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
   🔐 OpenAI API KEY
---------------------------------- */
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/* ----------------------------------
   🔐 BigQuery 인증
---------------------------------- */
let bigquery;

if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    const service = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    service.private_key = service.private_key.replace(/\\n/g, "\n");

    bigquery = new BigQuery({
        projectId: service.project_id,
        credentials: {
            client_email: service.client_email,
            private_key: service.private_key,
        }
    });
} else {
    bigquery = new BigQuery({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
}

/* ----------------------------------
   📌 공용 GPT 호출
---------------------------------- */
async function callGPT(messages) {
    try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages
            })
        });

        const data = await res.json();
        if (!res.ok) {
            console.error("GPT Error:", data);
            return "GPT 오류가 발생했습니다.";
        }

        return data.choices[0].message.content;
    } catch (err) {
        console.error("GPT 통신 오류:", err);
        return "GPT 요청 실패";
    }
}

/* ----------------------------------
   🧠 의약품 분석 System Prompt
---------------------------------- */
function buildMedicalPrompt() {
    return `
당신은 한국 의약품 정보를 설명하는 전문가입니다.

❗ 출력 규칙:
- 제목 앞에 숫자(1), 기호(*), 볼드(**) 절대 사용 금지
- 제목 형식 예: 약 개요 / 복용 시기 / 성분과 역할 / 주의사항 / 부작용
- 내용은 최대한 간단하게 (약국 상담 느낌)
- A/B/C 모드라는 표현 절대 쓰지 말 것
- DB에 없으면 반드시 "추정" 이라는 단어 포함
- 모든 정보는 한국 기준

📌 약 분석 구조 (약 이름 입력 시):
약 개요
언제 복용하나요
성분과 역할
병용 가능 여부
주의 대상
부작용

📌 증상 입력 시:
증상 분석
가능한 원인
추천 약품
주의사항
병원 방문 기준

📌 OCR 인식 불확실 시:
가능한 약 후보
약 특징 비교
가장 가능성 높은 약
주의사항
`;
}

/* ----------------------------------
   🔎 BigQuery 약 조회
---------------------------------- */
async function findMedicine(name) {
    const query = `
        SELECT *
        FROM \`${process.env.GCP_PROJECT_ID}.${process.env.BQ_DATASET}.${process.env.BQ_TABLE}\`
        WHERE product_name LIKE '%${name}%'
           OR product_name_en LIKE '%${name}%'
    `;

    const [rows] = await bigquery.query({ query });
    return rows.length ? rows[0] : null;
}

/* ----------------------------------
   OCR → 약 이름 추출
---------------------------------- */
async function extractFromOCR(text) {
    const out = await callGPT([
        { role: "system", content: "OCR 텍스트에서 약 이름만 줄바꿈으로 추출해라." },
        { role: "user", content: text }
    ]);

    return out.split("\n").map(v => v.trim()).filter(Boolean);
}

/* ----------------------------------
   입력 종류 자동 분류
---------------------------------- */
function classify(text) {
    const t = text.toLowerCase();

    const symptomWords = [
        "기침", "두통", "복통", "설사", "열", "콧물", "감기", "몸살",
        "통증", "아픔", "붓기", "현기증"
    ];

    const ocrSigns = ["mg", "정", "캡슐", "\n"];

    if (ocrSigns.some(k => t.includes(k))) return "OCR";
    if (symptomWords.some(k => t.includes(k))) return "SYMPTOM";
    return "DRUG";
}

/* ----------------------------------
   GPT 호출 wrapper
---------------------------------- */
async function askMedicalGPT(prompt, context = "") {
    const system = buildMedicalPrompt();

    return await callGPT([
        { role: "system", content: system },
        {
            role: "user",
            content: `
[추가 정보]
${context || "(없음)"}

[사용자 질문]
${prompt}
            `
        }
    ]);
}

/* ----------------------------------
   🔥 복합 분석 API
---------------------------------- */
app.post("/api/medicines/analyze", async (req, res) => {
    try {
        const { text } = req.body;
        const mode = classify(text);
        console.log("📌 감지된 모드:", mode);

        let medicines = [];
        let analysisResults = [];
        let finalAnalysis = "";

        /* ---------------------
           📌 OCR 모드
        --------------------- */
        if (mode === "OCR") {
            medicines = await extractFromOCR(text);

            if (!medicines.length) {
                return res.json({
                    finalAnalysis: "약 이름을 인식할 수 없습니다."
                });
            }

            for (const name of medicines) {
                const db = await findMedicine(name);

                let detail;

                if (!db) {
                    detail = await askMedicalGPT(
                        `"${name}" 은 DB 없음. 추정하여 약 정보 요약해줘.`
                    );
                } else {
                    const info = `
약 이름: ${db.product_name}
회사: ${db.company_name}
분류: ${db.classification}
성분수: ${db.ingredient_count}
`;

                    detail = await askMedicalGPT(
                        `"${db.product_name}" 약 정보 설명 (중복 없이 1회만 설명)`,
                        info
                    );
                }

                analysisResults.push(detail);
            }

            finalAnalysis = analysisResults.join("\n\n");
        }

        /* ---------------------
           📌 증상 모드
        --------------------- */
        else if (mode === "SYMPTOM") {
            finalAnalysis = await askMedicalGPT(
                `다음 증상 분석: ${text}`
            );
        }

        /* ---------------------
           📌 약 이름 입력 DRUG 모드
        --------------------- */
        else {
            medicines = text.split(/[,\s]/).filter(Boolean).slice(0, 3);

            for (const name of medicines) {
                const db = await findMedicine(name);

                let detail;

                if (!db) {
                    detail = await askMedicalGPT(
                        `"${name}" 은 DB없음. 추정하여 단일 약 정보 설명해줘.`
                    );
                } else {
                    const info = `
약 이름: ${db.product_name}
회사: ${db.company_name}
분류: ${db.classification}
성분수: ${db.ingredient_count}
`;

                    detail = await askMedicalGPT(
                        `"${db.product_name}" 약 정보 설명 (중복 없이 1회만 설명)`,
                        info
                    );
                }

                analysisResults.push(detail);
            }

            // ⭐ 중복 제거된 단일 결과 출력
            finalAnalysis = analysisResults.join("\n\n");
        }

        res.json({
            medicines,
            finalAnalysis
        });

    } catch (err) {
        console.error("Analyze Error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

/* ----------------------------------
   서버 실행
---------------------------------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
);
