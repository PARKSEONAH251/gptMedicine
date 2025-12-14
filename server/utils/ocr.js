import tesseract from "node-tesseract-ocr";

const config = {
  lang: "kor+eng",
  oem: 1,
  psm: 6,
  binary: `"C:\\Program Files\\Tesseract-OCR\\tesseract.exe"`,
};

export async function extractTextFromImage(imagePath) {
  try {
    return await tesseract.recognize(imagePath, config);
  } catch (e) {
    console.error("OCR 실패:", e);
    return "";
  }
}
