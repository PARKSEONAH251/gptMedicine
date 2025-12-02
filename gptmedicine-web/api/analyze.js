import { BigQuery } from "@google-cloud/bigquery";

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }

        const { text } = req.body;
        if (!text) return res.status(400).json({ error: "text is required" });

        console.log("🔍 Input:", text);

        const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

        const bigquery = new BigQuery({
            projectId: serviceAccount.project_id,
            credentials: {
                client_email: serviceAccount.client_email,
                private_key: serviceAccount.private_key
            }
        });

        /* ============================
           공통 OpenAI 호출
        ============================ */
        async function callGPT(messages) {
            const resGPT = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages
                })
            });

            const data = await resGPT.json();
            return data.choices?.[0]?.message?.content || "GPT 오류 발생";
        }

        /* ============================
           입력 텍스트 자동 분류
        ============================ */
        function classifyInput(t) {
            const text = t.toLowerCase();
            const symptom = ["감기", "콧물", "기침", "열", "두통", "몸살", "목 아파", "코막힘"];
            const isSymptom = symptom.some(k => text.includes(k));
            const isOCR = text.includes("\n") || text.match(/[0-9]+mg/);
            if (isOCR) return "OCR_TEXT";
            if (isSymptom) return "SYMPTOM";
            return "DRUG";
        }

        const mode = classifyInput(text);
        console.log("📌 Mode:", mode);

        /* ===================================================
           OCR: 약 이름 추출
        =================================================== */
        async function extractNamesFromOCR(input) {
            const res = await callGPT([
                { role: "system", content: "텍스트에서 약 이름만 추출해라. 숫자/단위 제거. 줄바꿈으로만 출력." },
                { role: "user", content: input }
            ]);

            return res.split("\n").map(v => v.trim()).filter(Boolean);
        }

        /* ===================================================
           BigQuery 조회 함수
        =================================================== */
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

        /* ===================================================
           메인 처리 로직
        =================================================== */

        let medicines = [];
        let analysisResults = [];
        let combinedInteraction = "";
        let finalAnalysis = "";

        /* --- ① OCR 모드 --- */
        if (mode === "OCR_TEXT") {
            medicines = await extractNamesFromOCR(text);
            if (medicines.length === 0) {
                return res.json({
                    medicines: [],
                    analysisResults: [],
                    combinedInteraction: "약 이름을 찾지 못했습니다.",
                    finalAnalysis: "약 이름 인식 실패."
                });
            }

            for (const name of medicines) {
                const db = await findMedicine(name);
                if (!db) {
                    const guess = await callGPT([
                        { role: "system", content: "약 분석 A모드" },
                        { role: "user", content: `"${name}" 은 DB에 없음. 추정해서 A모드로 설명.` }
                    ]);
                    analysisResults.push({ name, analysis: guess });
                } else {
                    const detail = await callGPT([
                        { role: "system", content: "약 분석 A모드" },
                        { role: "user", content: `다음 약을 1~8 항목으로 분석하라: ${JSON.stringify(db)}` }
                    ]);
                    analysisResults.push({ name, analysis: detail });
                }
            }

            combinedInteraction = await callGPT([
                { role: "system", content: "복용 상호작용 분석 전문가" },
                { role: "user", content: medicines.join(", ") + " 함께 복용 시 상호작용 분석해줘" }
            ]);

            finalAnalysis =
                analysisResults.map(r => r.analysis).join("\n\n") +
                "\n\n" +
                combinedInteraction;
        }

        /* --- ② 증상 모드 --- */
        else if (mode === "SYMPTOM") {
            const symptomAnswer = await callGPT([
                { role: "system", content: "증상별 약 추천 전문가" },
                { role: "user", content: `증상: ${text}` }
            ]);

            finalAnalysis = symptomAnswer;
        }

        /* --- ③ 단일 약 정보 모드 --- */
        else {
            medicines = text.split(/[ ,\n]/).filter(Boolean).slice(0, 3);

            for (const name of medicines) {
                const db = await findMedicine(name);

                if (!db) {
                    const guess = await callGPT([
                        { role: "system", content: "약 요약 C모드" },
                        { role: "user", content: `${name} 이 어떤 약인지 추정해서 요약.` }
                    ]);
                    analysisResults.push({ name, analysis: guess });
                } else {
                    const detail = await callGPT([
                        { role: "system", content: "약 분석 A/B/C 모드" },
                        { role: "user", content: `질문: ${text} \n DB 정보: ${JSON.stringify(db)}` }
                    ]);
                    analysisResults.push({ name, analysis: detail });
                }
            }

            finalAnalysis = analysisResults.map(r => r.analysis).join("\n\n");
        }

        return res.json({
            medicines,
            analysisResults,
            combinedInteraction,
            finalAnalysis
        });

    } catch (err) {
        console.error("Analyze Error:", err);
        return res.status(500).json({ error: "Server Error" });
    }
}
