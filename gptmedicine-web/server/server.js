// server/server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { BigQuery } from "@google-cloud/bigquery";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

const bigquery = new BigQuery({
    projectId: serviceAccount.project_id,
    credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key
    }
});

/* -------------------------------------------------------
   공통: OpenAI 호출 래퍼
--------------------------------------------------------- */
async function callOpenAI(messages) {
    try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages,
            }),
        });

        const data = await res.json();
        if (!res.ok) {
            console.error("GPT Error:", data);
            return "GPT 요청 중 오류가 발생했습니다.";
        }
        return data.choices[0].message.content;
    } catch (err) {
        console.error("GPT 통신 오류:", err);
        return "GPT 요청 중 오류가 발생했습니다.";
    }
}

/* -------------------------------------------------------
   ⭐ 의료 AI system prompt (A/B/C 모드 + 증상 세분화 + 보조제)
--------------------------------------------------------- */
function buildMedicalSystemPrompt() {
    return `
당신은 전문 의약품 분석 AI 비서입니다.
반드시 한국 기준 일반의약품/전문의약품/건강기능식품 관점에서 설명합니다.
사용자의 질문 성격에 따라 3가지 모드 중 하나를 자동 선택해 출력합니다.

====================================================
[A 모드: 상세 분석 모드 → 1~8 전체 구조 출력]
====================================================
다음 단어 중 하나라도 포함되면 A 모드를 사용합니다.

키워드:
"분석", "상세", "자세히", "자세한 설명", "성분 분석", 
"주의사항", "병용", "함께 먹어도", "상호작용", "인터랙션",
"부작용", "약 정보", "성분 알려줘"

출력 형식 :
1) 약 소개
2) 주요 성분
3) 효능 / 효과
4) 복용 시 주의사항
5) 함께 복용하면 안 되는 약물
6) 권장 복용법
7) 대체 약품 (일반의약품/동일계열 제제 위주)
8) 추가 참고 정보

====================================================
[B 모드: 증상 기반 추천 모드]
====================================================
질문에 다음 키워드 포함 시 사용합니다.

키워드:
"증상", "아픈데", "통증", "두통", "감기", "몸살", "기침",
"열", "복통", "콧물", "코막힘", "목 아픔", "목이 아파",
"목감기", "코감기", "추천", "뭐 먹지", "무슨 약",
"약 뭐가 좋아"

추가 규칙:
- 증상을 다음 네 가지로 먼저 분류:
  • 코감기 타입: 콧물, 재채기, 코막힘 중심
  • 목감기 타입: 인후통, 기침, 목 따가움, 가래 중심
  • 몸살감기 타입: 근육통, 관절통, 오한, 고열 중심
  • 기타 증상/복합 타입: 소화불량 동반, 편두통, 알레르기 의심 등
- 각 타입별로 일반의약품/복합제 예시를 제시
- 필요시 건강기능식품/보조제(비타민 C, 비타민 D, 아연, 프로폴리스, 유산균 등)를
  "면역·회복 보조용"으로만 언급 (치료제처럼 말하지 말 것)

출력 형식:
📌 증상 분류
- 코감기 / 목감기 / 몸살감기 / 기타 중 무엇인지 설명

📌 추천 약품 (최대 3개)
- 약 이름(또는 계열명) + 핵심 효능 1~2개
- 가능하면 "일반의약품" / "전문의약품" / "건강기능식품" 구분

📌 보조제/생활습관
- 도움이 될 수 있는 보조제(비타민 C, 아연, 프로폴리스 등)와
  수분섭취, 휴식, 가습 등 생활습관 팁

📌 주의사항
- 임산부, 소아, 고령자, 간/신장 질환자, 기저질환자 등의 주의점
- 장기 복용 금지, 병원 진료가 필요한 경우 기준

====================================================
[C 모드: 약 이름만 있을 때 → 간단 요약 모드]
====================================================
사용자 질문이 아래 패턴과 유사하면 C 모드 적용:

예시:
- “타이레놀?”
- “펜잘은?”
- “이 약 뭐야?”
- “어떤 약이야?”
- "타이레놀 설명"
- "브루펜?"

출력 형식:
📌 약 이름
📌 주요 성분
📌 주요 효과
📌 기본 주의사항(한 줄)

====================================================
🟧 공통 규칙
====================================================
✔ 출력은 항상 한국어
✔ 틀린 의학 정보 절대 금지
✔ 표(테이블) 사용 금지, bullet 사용
✔ 브랜드명 & 성분명 함께 제공 (알고 있는 경우)
✔ 복용 용량은 "일반적인 성인 기준"으로만 대략 설명하고,
  구체적인 용량 조정은 의사·약사와 상의하라고 안내
✔ 이 정보는 "의료진 상담을 대체하지 못하는 참고용"임을 주기적으로 언급
`;
}

/* -------------------------------------------------------
   A/B/C 모드 적용 답변 생성기
--------------------------------------------------------- */
async function askMedicalGPT(userPrompt, extraContext = "") {
    const system = buildMedicalSystemPrompt();

    const messages = [
        { role: "system", content: system },
        {
            role: "user",
            content: `
[추가 컨텍스트]
${extraContext || "(없음)"}

[사용자 질문]
${userPrompt}
            `,
        },
    ];

    return await callOpenAI(messages);
}

/* -------------------------------------------------------
   BigQuery 약 정보 조회
--------------------------------------------------------- */
async function findMedicineInDB(name) {
    const query = `
        SELECT *
        FROM \`${process.env.GCP_PROJECT_ID}.${process.env.BQ_DATASET}.${process.env.BQ_TABLE}\`
        WHERE product_name LIKE '%${name}%'
           OR product_name_en LIKE '%${name}%'
    `;

    const [rows] = await bigquery.query({ query });

    if (rows.length === 0) return null;
    return rows[0];
}

/* -------------------------------------------------------
   간단한 텍스트 분류기:
   - OCR_TEXT: 처방전/OCR 텍스트 느낌
   - SYMPTOM: 증상 설명
   - DRUG: 약 이름/브랜드 느낌
--------------------------------------------------------- */
function classifyInput(text) {
    const t = text.toLowerCase();

    const symptomKeywords = [
        "감기", "기침", "콧물", "코막힘", "목 아파", "목이 아파",
        "인후통", "두통", "편두통", "몸살", "열", "발열",
        "복통", "설사", "메스꺼움", "구역질", "구토", "증상"
    ];
    const ocrHints = [
        "정", "캡슐", "정제", "시럽", "mg", "ml", "1일", "1회", "용량",
        "복용", "식후", "식전"
    ];

    const hasSymptom = symptomKeywords.some(k => text.includes(k));
    const hasOCR = ocrHints.some(k => text.includes(k)) || text.includes("\n");

    if (hasOCR) return "OCR_TEXT";
    if (hasSymptom) return "SYMPTOM";
    return "DRUG";
}

/* -------------------------------------------------------
   OCR 텍스트 → 약 이름 추출 (GPT 사용)
--------------------------------------------------------- */
async function extractNamesFromOCR(text) {
    const extractPrompt = `
다음은 OCR에서 추출한 텍스트입니다.

규칙:
- 약 이름만 1~5개 추출
- 줄바꿈으로만 구분
- 숫자/단위 제거
- OCR 오류 최대한 보정
- 설명/복용법/단위는 제거

OCR 내용:
${text}
`;

    const raw = await callOpenAI([
        {
            role: "system",
            content: `
너는 OCR에서 인식된 텍스트에서 "약 이름만" 뽑아내는 도우미이다.
출력 형식은 약 이름만 줄바꿈으로 나열한다.
설명/용법/숫자/단위는 절대 포함하지 않는다.
            `,
        },
        { role: "user", content: extractPrompt },
    ]);

    return raw
        .split("\n")
        .map(v => v.trim())
        .filter(v => v.length > 0);
}

/* -------------------------------------------------------
   1) 단일 약 정보 조회 API (원래 있던 기능 유지)
--------------------------------------------------------- */
app.get("/api/medicine-info", async (req, res) => {
    try {
        const name = req.query.name;
        if (!name) return res.status(400).json({ error: "name is required" });

        const db = await findMedicineInDB(name);
        if (!db) {
            return res.json({ found: false, item: null });
        }
        return res.json({ found: true, item: db });

    } catch (error) {
        console.error("BigQuery Error:", error);
        return res.status(500).json({ error: "BigQuery lookup failed" });
    }
});

/* -------------------------------------------------------
   2) 메인 API: 증상 + 약 이름 + OCR 모두 처리
      - 프론트의 SearchResult 에서 사용
--------------------------------------------------------- */
app.post("/api/medicines/analyze", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: "text is required" });

        const mode = classifyInput(text);
        console.log("🔍 Input mode:", mode);

        // 공통 응답 틀
        let medicines = [];
        let analysisResults = [];
        let combinedInteraction = "";
        let finalAnalysis = "";

        /* =========================
           ① OCR 텍스트 → 약 여러 개
        ========================== */
        if (mode === "OCR_TEXT") {
            const names = await extractNamesFromOCR(text);
            if (names.length === 0) {
                return res.json({
                    medicines: [],
                    analysisResults: [],
                    combinedInteraction: "OCR에서 약 이름을 찾지 못했습니다.",
                    finalAnalysis: "약 이름을 인식하지 못했습니다.",
                });
            }

            medicines = names;
            const dbSummaries = [];

            for (const name of names) {
                const db = await findMedicineInDB(name);

                if (!db) {
                    const guess = await askMedicalGPT(
                        `"${name}" 은(는) DB에 존재하지 않는 약입니다. 이름만 보고 추정해서 A 모드 형식으로 설명해 주세요. "추정 정보"임을 명시하세요.`,
                        ""
                    );
                    analysisResults.push({ name, analysis: guess });
                    dbSummaries.push(`- ${name}: DB 정보 없음`);
                    continue;
                }

                const dbInfo = `
약 이름: ${db.product_name}
회사명: ${db.company_name}
영문명: ${db.product_name_en}
분류: ${db.classification}
주성분 수: ${db.ingredient_count}
허가일: ${db.product_license_date}
                `;

                const detail = await askMedicalGPT(
                    `"${db.product_name}" 에 대해 A 모드 형식(1~8)을 사용해 상세 분석해 주세요.`,
                    `[한국 의약품 DB 정보]\n${dbInfo}`
                );

                analysisResults.push({ name, analysis: detail });
                dbSummaries.push(`- ${name}: 분류=${db.classification}, 성분수=${db.ingredient_count}`);
            }

            combinedInteraction = await askMedicalGPT(
                `다음 약들을 동시에 복용할 때 병용 상호작용을 분석해 주세요.`,
                dbSummaries.join("\n")
            );

            finalAnalysis =
                analysisResults.map(r => r.analysis).join("\n\n") +
                "\n\n" +
                combinedInteraction;
        }

        /* =========================
           ② 증상 질문 (코감기/목감기/몸살/기타 + 보조제 추천)
        ========================== */
        else if (mode === "SYMPTOM") {
            const symptomAnswer = await askMedicalGPT(
                `
다음은 사용자의 증상 설명입니다. 
1) 먼저 코감기/목감기/몸살감기/기타 중 어떤 타입인지 분류하고
2) 그 타입에 맞는 일반의약품/복합제 예시,
3) 필요시 건강기능식품/보조제(비타민 C, 아연, 프로폴리스 등),
4) 생활습관 팁,
5) 주의사항(임산부, 소아, 고령자, 기저질환자)을
B 모드 출력 형식에 맞춰 정리해 주세요.
`,
                `[증상 입력]\n${text}`
            );

            medicines = [];
            analysisResults = [{ name: "증상 분석", analysis: symptomAnswer }];
            combinedInteraction = "";
            finalAnalysis = symptomAnswer;
        }

        /* =========================
           ③ 약 이름/브랜드 질문 (단일 또는 소수)
        ========================== */
        else {
            // 단순하게 콤마/공백으로 잘라서 최대 3개까지만 약 이름 후보로 사용
            const rawNames = text
                .split(/[,\n]/)
                .map(v => v.trim())
                .filter(v => v.length > 0);
            const uniqueNames = [...new Set(rawNames)].slice(0, 3);

            medicines = uniqueNames.length ? uniqueNames : [text.trim()];
            const dbSummaries = [];

            for (const name of medicines) {
                const db = await findMedicineInDB(name);

                if (!db) {
                    const guess = await askMedicalGPT(
                        `사용자가 "${name}" 이라는 약에 대해 궁금해합니다. C 모드 또는 A 모드 중 적절한 형식으로,
                        이 약이 어떤 계열일 가능성이 있는지, 주요 효능과 주의사항을 "추정" 기반으로 설명해 주세요.
                        "추정 정보"임을 명시하세요.`,
                        ""
                    );
                    analysisResults.push({ name, analysis: guess });
                    dbSummaries.push(`- ${name}: DB 정보 없음`);
                    continue;
                }

                const dbInfo = `
약 이름: ${db.product_name}
회사명: ${db.company_name}
영문명: ${db.product_name_en}
분류: ${db.classification}
주성분 수: ${db.ingredient_count}
허가일: ${db.product_license_date}
                `;

                const detail = await askMedicalGPT(
                    `"${db.product_name}" 에 대해, 사용자가 "${text}" 라고 질문했습니다.
질문의 뉘앙스를 반영해서 A/B/C 모드 중 적절한 형식으로 설명해 주세요.`,
                    `[한국 의약품 DB 정보]\n${dbInfo}`
                );

                analysisResults.push({ name, analysis: detail });
                dbSummaries.push(`- ${name}: 분류=${db.classification}, 성분수=${db.ingredient_count}`);
            }

            combinedInteraction = "";
            finalAnalysis = analysisResults.map(r => r.analysis).join("\n\n");
        }

        return res.json({
            medicines,
            analysisResults,
            combinedInteraction,
            finalAnalysis,
        });

    } catch (err) {
        console.error("Analyze API Error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

/* -------------------------------------------------------
   서버 실행
--------------------------------------------------------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server on ${PORT}`));
