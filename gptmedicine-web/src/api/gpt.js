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
                        content: `
당신은 전문 의약품 분석 AI 비서입니다.
사용자가 어떤 질문을 하더라도 아래의 **항목 전체를 반드시 포함**해 설명합니다.

출력 형식(한글):

[약 정보 요약]
- 주성분:
- 약효:
- 복용법:
- 복용 시 주의사항:
- 금기 사항(먹으면 안 되는 사람):
- 부작용:
- 상호작용(함께 복용하면 안 되는 약):
- 비슷한 다른 약품:
- 추가 의학적 조언:

만약 사용자 질문이 모호하거나 약 이름이 불명확하면 가장 가능성 높은 후보를 제시하세요.
절대 항목을 생략하거나 구조를 바꾸지 마세요.
                        `
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
        console.error("GPT 호출실패:", error);
        return "GPT 요청 중 오류가 발생했습니다.";
    }
}
