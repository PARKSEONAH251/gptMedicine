import fs from "fs";
import path from "path";

const drugFilePath = path.resolve("./data/drugData.json");
const drugList = JSON.parse(fs.readFileSync(drugFilePath, "utf-8"));

/**
 * 문자열 정규화
 * - 괄호 및 괄호 안 제거
 * - 특수문자 제거
 * - 공백 제거
 * - 소문자 변환
 */
function normalize(text) {
  if (!text) return "";

  return text
    .replace(/\(.*?\)/g, "")
    .replace(/[^가-힣a-zA-Z0-9]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

/**
 * OCR/텍스트 기반 약품 검색 (단일 진입점)
 */
export function findDrugByText(text) {
  if (!text) return null;

  const normalizedText = normalize(text);

  // OCR 텍스트를 단어 단위로 분해
  const tokens = text
    .split(/\s+/)
    .map(normalize)
    .filter((t) => t.length >= 2);

  return drugList.find((drug) => {
    const drugName = normalize(drug["품목명"]);
    if (!drugName) return false;

    // 1️⃣ 전체 텍스트 포함 여부
    if (
      drugName.includes(normalizedText) ||
      normalizedText.includes(drugName)
    ) {
      return true;
    }

    // 2️⃣ 토큰 단위 비교 (OCR 깨짐 대응)
    return tokens.some(
      (token) =>
        drugName.includes(token) || token.includes(drugName)
    );
  }) || null;
}
