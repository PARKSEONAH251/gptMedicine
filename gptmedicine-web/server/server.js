import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { BigQuery } from "@google-cloud/bigquery";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// BigQuery 인증
const bigquery = new BigQuery({
    projectId: process.env.GCP_PROJECT_ID,
    keyFilename: "./service-account.json",
});

// 공통 GPT 호출 함수
async function callGPT(messages) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages,
        }),
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "GPT 오류";
}

// BigQuery 조회
async function findMedicine(name) {
    const query = `
        SELECT *
        FROM \`${process.env.GCP_PROJECT_ID}.${process.env.BQ_DATASET}.${process.env.BQ_TABLE}\`
        WHERE product_name LIKE '%${name}%'
           OR product_name_en LIKE '%${name}%'
    `;

    const [rows] = await bigquery.query({ query });
    return rows[0] || null;
}

// OCR → 약 이름 추출
async function extractNamesFromOCR(text) {
    const out = await callGPT([
        { role: "system", content: "텍스트에서 약 이름만 추출해라. 줄바꿈으로만 출력." },
        { role: "user", content: text },
    ]);
    return out.split("\n").map(x => x.trim()).filter(Boolean);
}

// **메인 분석 API**
app.post("/api/analyze", async (req, res) => {
    try {
        const { text } = req.body;

        // OCR 분석
        let names = [];
        if (text.includes("\n") || text.includes("mg")) {
            names = await extractNamesFromOCR(text);
        } else {
            names = text.split(/[ ,\n]+/g).slice(0, 3);
        }

        const analysisResults = [];

        for (const name of names) {
            const db = await findMedicine(name);
            if (!db) {
                // DB 없음 → GPT 추정 분석
                const guess = await callGPT([
                    { role: "system", content: "약 분석 전문가" },
                    { role: "user", content: `"${name}"은 DB에 없음. 추정해서 설명해줘.` },
                ]);
                analysisResults.push({ name, analysis: guess });
            } else {
                // DB 있음 → 상세 분석
                const detail = await callGPT([
                    { role: "system", content: "약 분석 전문가" },
                    { role: "user", content: `다음 약을 분석해줘: ${JSON.stringify(db)}` },
                ]);
                analysisResults.push({ name, analysis: detail });
            }
        }

        const finalAnalysis = analysisResults.map(r => r.analysis).join("\n\n");

        res.json({
            medicines: names,
            analysisResults,
            finalAnalysis,
        });
    } catch (err) {
        console.error("Analyze Error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

// 서버 실행
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 API 서버 실행됨: ${PORT}`));
