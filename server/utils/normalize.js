export function normalizeText(text) {
  return text
    .replace(/\n+/g, " ")
    .replace(/[^\w가-힣%]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
