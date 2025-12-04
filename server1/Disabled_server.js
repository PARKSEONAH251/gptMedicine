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

/* ----------------------------------
   🔐 OpenAI API
---------------------------------- */
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/* ----------------------------------
   🔐 BigQuery 인증 (로컬/배포 자동 분기)
---------------------------------- */
let bigquery;

if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

    bigquery = new BigQuery({
        projectId: serviceAccount.project_id,
        credentials: {
            client_email: serviceAccount.client_email,
            private_key: serviceAccount.private_key,
        },
    });
} else {
    bigquery = new BigQuery({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
}

/* ----------------------------------
   📌 OpenAI 호출 공통 함수
---------------------------------- */
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

/* ----------------------------------
   🔥 원래 Prompt 100% 포함된 System Prompt
---------------------------------- */
function buildMedicalSystemPrompt() {
    return `
당신은 한국 의약품 정보를 알려주는 전문 의약품 AI입니다.

답변할 때 "A 모드", "B 모드", "C 모드" 같은 표현은 절대 출력하지 말고,  
항상 간단한 제목(약 개요, 복용 시기, 주의사항 등)으로 정리해서 설명합니다.

사용자의 입력은 다음 3가지 유형으로 구분해 자동 처리하세요:

------------------------------------------------------
🔹 1) 약 이름이 들어온 경우 → 약 정보 상세 설명
------------------------------------------------------
항상 아래 1~6 구조로 짧은 제목으로만 출력:

1) **약 개요**  
2) **언제 복용하는지**  
3) **성분 & 작용**  
4) **다른 약과의 병용 여부**  
5) **주의 대상(임산부/고령자/질환자)**  
6) **부작용**  

조건:
- 제목은 반드시 매우 간단하게 (5글자~10글자 안)
- 불필요한 긴 문장 제거
- 약국에서 환자에게 설명하듯 쉽고 간단하게

------------------------------------------------------
🔹 2) 증상이 들어온 경우 → 증상 기반 안내
------------------------------------------------------
아래 구조로 짧은 제목으로 설명:

1) **증상 분석**  
2) **가능한 원인**  
3) **추천 약품(3~5개)**  
4) **주의사항**  
5) **병원 방문 기준**

------------------------------------------------------
🔹 3) 약 이름이 불확실하거나 OCR 오류인 경우
------------------------------------------------------
아래 구조로 간단한 제목으로만 출력:

1) **가능한 약 후보**  
2) **각 후보 특징 비교**  
3) **가장 가능성 높은 약**  
4) **주의사항**

------------------------------------------------------
📌 공통 규칙
------------------------------------------------------
- 절대 모드명(A/B/C)은 출력하지 않는다.
- 제목은 무조건 짧게:  
  예) “약 개요”, “주의사항”, “병용 가능 여부”
- DB(BigQuery)에서 약이 발견되면 반드시 그 약 기준으로 설명
- DB에 없으면 추정하되 “추정”이라는 단어를 반드시 포함
- 모든 설명은 한국 기준

`;
}

/* ----------------------------------
   GPT 의료 응답 생성
---------------------------------- */
async function askMedicalGPT(userPrompt, extraContext = "") {
    const system = buildMedicalSystemPrompt();

    return await callOpenAI([
        { role: "system", content: system },
        {
            role: "user",
            content: `
[약 추가 정보]
${extraContext || "(없음)"}

[사용자 질문]
${userPrompt}
            `,
        },
    ]);
}

/* ----------------------------------
   📌 BigQuery 조회 함수
---------------------------------- */
async function findMedicineInDB(name) {
    const query = `
        SELECT *
        FROM \`${process.env.GCP_PROJECT_ID}.${process.env.BQ_DATASET}.${process.env.BQ_TABLE}\`
        WHERE product_name LIKE '%${name}%'
           OR product_name_en LIKE '%${name}%'
    `;

    const [rows] = await bigquery.query({ query });
    return rows.length > 0 ? rows[0] : null;
}

/* ----------------------------------
   OCR → 약 이름만 추출
---------------------------------- */
async function extractNamesFromOCR(text) {
    const result = await callOpenAI([
        {
            role: "system",
            content: "OCR 텍스트에서 약 이름만 정확히 추출해라. 줄바꿈으로 구분.",
        },
        { role: "user", content: text },
    ]);

    return result
        .split("\n")
        .map((v) => v.trim())
        .filter((v) => v.length > 0);
}

/* ----------------------------------
   간단 분류기
---------------------------------- */
function classifyInput(text) {
    const t = text.toLowerCase();

    const symptoms = [
        "기침", "두통", "설사", "복통", "감기", "콧물",
        "열", "몸살", "목", "통증", "증상"
    ];

    const ocrSign = ["mg", "정", "캡슐", "\n"];

    if (ocrSign.some((m) => t.includes(m))) return "OCR_TEXT";
    if (symptoms.some((s) => t.includes(s))) return "SYMPTOM";
    return "DRUG";
}

/* ----------------------------------
   📌 API — 약 정보 조회
---------------------------------- */
app.get("/api/medicine-info", async (req, res) => {
    try {
        const name = req.query.name;
        if (!name) return res.status(400).json({ error: "name required" });

        const db = await findMedicineInDB(name);

        res.json({
            found: !!db,
            item: db || null,
        });

    } catch (err) {
        console.error("BigQuery Error:", err);
        res.status(500).json({ error: "BigQuery lookup failed" });
    }
});

/* ----------------------------------
   📌 API — 복합 분석 (A/B/C/OCR)
---------------------------------- */
app.post("/api/medicines/analyze", async (req, res) => {
    try {
        const { text } = req.body;

        const mode = classifyInput(text);
        console.log("📌 감지된 모드:", mode);

        let medicines = [];
        let analysisResults = [];
        let combinedInteraction = "";
        let finalAnalysis = "";

        /* -----------------------
           🔵 1) OCR 모드
        ------------------------ */
        if (mode === "OCR_TEXT") {
            medicines = await extractNamesFromOCR(text);

            if (medicines.length === 0) {
                return res.json({
                    medicines: [],
                    analysisResults: [],
                    combinedInteraction: "",
                    finalAnalysis: "약 이름을 인식하지 못했습니다.",
                });
            }

            const dbSummaries = [];

            for (const name of medicines) {
                const db = await findMedicineInDB(name);

                if (!db) {
                    const guess = await askMedicalGPT(
                        `"${name}" 은 DB에 없음. 추정 A/C 모드로 설명해줘.`,
                        ""
                    );
                    analysisResults.push({ name, analysis: guess });
                    continue;
                }

                const info = `
약 이름: ${db.product_name}
회사: ${db.company_name}
분류: ${db.classification}
성분수: ${db.ingredient_count}
`;

                const detail = await askMedicalGPT(
                    `"${db.product_name}" 상세 분석 (A모드 1~8항목 모두 포함)`,
                    info
                );

                analysisResults.push({ name, analysis: detail });
                dbSummaries.push(info);
            }

            combinedInteraction = await askMedicalGPT(
                `이 약들을 함께 복용 시 상호작용 분석`,
                dbSummaries.join("\n")
            );

            finalAnalysis =
                analysisResults.map((r) => r.analysis).join("\n\n") +
                "\n\n📌 [동시 복용 분석]\n" +
                combinedInteraction;
        }

        /* -----------------------
           🟡 2) 증상 기반(B모드)
        ------------------------ */
        else if (mode === "SYMPTOM") {
            finalAnalysis = await askMedicalGPT(
                "증상 기반 약 추천(B모드)",
                `[증상]\n${text}`
            );
        }

        /* -----------------------
           🟢 3) 일반 약 이름 (A/C 모드)
        ------------------------ */
        else {
            medicines = text.split(/[,\s]/).filter((v) => v).slice(0, 3);

            for (const name of medicines) {
                const db = await findMedicineInDB(name);

                if (!db) {
                    const guess = await askMedicalGPT(
                        `"${name}" 은 DB 없음. C모드 기반 추정.`,
                        ""
                    );
                    analysisResults.push({ name, analysis: guess });
                    continue;
                }

                const info = `
약 이름: ${db.product_name}
회사: ${db.company_name}
분류: ${db.classification}
성분수: ${db.ingredient_count}
`;

                const detail = await askMedicalGPT(
                    `"${db.product_name}" 분석 (A/B/C 자동 결정 포함)`,
                    info
                );

                analysisResults.push({ name, analysis: detail });
            }

            finalAnalysis = analysisResults
                .map((r) => r.analysis)
                .join("\n\n");
        }

        res.json({
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

/* ----------------------------------
   서버 시작
---------------------------------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
);
