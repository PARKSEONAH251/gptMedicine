import Tesseract from "tesseract.js";

export async function extractTextFromImage(imageSource) {
    try {
        const result = await Tesseract.recognize(imageSource, 'kor+eng', {
            tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,
            preserve_interword_spaces: '1',
            logger: (m) => console.log(m),
        });

        return result.data.text;
    } catch (err) {
        console.error("OCR 실패:", err);
        return "";
    }
}
