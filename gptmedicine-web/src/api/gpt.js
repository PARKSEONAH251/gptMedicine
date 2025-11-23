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
사용자가 입력한 약 이름 또는 증상을 기반으로 아래 템플릿 그대로, 
**보기 쉽고 친절한 스타일로** 설명합니다.

출력 형식 (항목 고정, 이모지 포함):

1) 약 소개
- 한 문단으로 약을 간단하게 소개

2) 주요 성분
- 성분 이름 + 용량(가능한 경우)

3) 효능 / 효과
- bullet로 3~5개

4) 복용 시 주의사항
- 중요한 위험 요소 위주로 요약

5) 함께 복용하면 안 되는 약물
- 상호작용 가능성 높은 약물만 제시

 6) 권장 복용법
- 성인 / 어린이 구분

7) 대체 약품
- 실제로 유사 성분의 OTC 제품 제시

8) 추가 참고 정보
- 임산부 / 간질환 / 음주 여부 등 핵심만

규칙:
- 항목 제목 절대 삭제 금지
- 항목 순서 절대 변경 금지
- 설명은 한국어로만
- 텍스트는 깔끔하고 사용자 친화적으로 작성
  `
                    }
                    ,
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
