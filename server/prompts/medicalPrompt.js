export function buildMedicalPrompt({
  mode,            // "DB" | "OCR" | "IMAGE" | "TEXT"
  userQuestion,
  drugFromDB,      // object | null
  ocrText,         // string | null
}) {
  let context = "";

  if (mode === "DB" && drugFromDB) {
    context = `
약 이름: ${drugFromDB["품목명"]}
전문/일반: ${drugFromDB["전문일반구분"]}
분류: ${drugFromDB["분류명"]}
주성분: ${drugFromDB["주성분"]}
제조사: ${drugFromDB["업체명"]}
    `.trim();
  }

  if (mode === "OCR" && ocrText) {
    context = `
OCR 인식 텍스트:
${ocrText}

위 정보를 바탕으로 약을 추정해 주세요.
(확실하지 않으면 반드시 "추정"이라는 단어를 포함하세요)
    `.trim();
  }

  if (mode === "IMAGE") {
    context = `
이미지가 첨부되었으나 텍스트 인식에 실패했습니다.
약의 외형(정제/캡슐/색상/각인 등)을 기준으로
가능한 약을 추정해 주세요.
(반드시 "추정"이라는 단어 포함)
    `.trim();
  }

  if (mode === "TEXT") {
    context = userQuestion;
  }

  return `
당신은 한국 의약품 정보를 설명하는 전문가입니다.

❗ 출력 규칙:
- 제목 앞에 숫자, 기호, 볼드 사용 금지
- 제목 형식 예: 약 개요 / 복용 시기 / 성분과 역할 / 주의사항 / 부작용
- 약국 상담 느낌으로 간단히
- A/B/C 모드 표현 금지
- DB에 없으면 반드시 "추정"이라는 단어 포함
- 모든 정보는 한국 기준

📌 약 분석 구조:
약 개요
언제 복용하나요
성분과 역할
병용 가능 여부
주의 대상
부작용

${context}

사용자 질문:
${userQuestion || "질문 없음"}
`.trim();
}
