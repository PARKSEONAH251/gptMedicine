const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

export async function askGPT(userText) {
    try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            "당신은 약 성분, 상호작용, 복용 금기 등을 설명하는 전문 의약품 AI 비서입니다. 의학 정보를 정확하고 쉽게 설명하세요."
                    },
                    {
                        role: "user",
                        content: userText,
                    },
                ],
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("GPT Error:", data);
            return "GPT 요청 중 오류가 발생했습니다.";
        }

        return data.choices[0].message.content;
    } catch (error) {
        console.error("GPT 호출 실패:", error);
        return "GPT 요청 중 오류가 발생했습니다.";
    }
}
