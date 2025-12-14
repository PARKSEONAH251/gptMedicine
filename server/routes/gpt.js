import express from "express";
import OpenAI from "openai";
import multer from "multer";
import path from "path";
import fs from "fs";

import { verifyToken } from "../middleware/verifyToken.js";
import { extractTextFromImage } from "../utils/ocr.js";
import { findDrugByText } from "../utils/findDrugByText.js";
import { buildMedicalPrompt } from "../prompts/medicalPrompt.js";
import Favorite from "../models/Favorite.js";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* =========================
   multer 설정
========================= */
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadDir),
    filename: (_, file, cb) =>
      cb(null, `${Date.now()}${path.extname(file.originalname)}`),
  }),
});

/* =========================
   /api/gpt/medical
========================= */
router.post(
  "/medical",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const userID = req.user.userID;
      const question = req.body.question?.trim() || "";
      const imageFile = req.file || null;

      let ocrText = null;
      let matchedDrug = null;
      let mode = "TEXT";

      if (imageFile) {
        try {
          ocrText = await extractTextFromImage(imageFile.path);
          if (ocrText) {
            matchedDrug = findDrugByText(ocrText);
            mode = matchedDrug ? "DB" : "OCR";
          } else {
            mode = "IMAGE";
          }
        } catch {
          mode = "IMAGE";
        }
      }

      if (!imageFile && question) {
        matchedDrug = findDrugByText(question);
        mode = matchedDrug ? "DB" : "TEXT";
      }

      const prompt = buildMedicalPrompt({
        mode,
        userQuestion: question,
        drugFromDB: matchedDrug,
        ocrText,
      });

      const gptRes = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: prompt,
      });

      const answer = gptRes.output_text || "응답 없음";

      /* =========================
         결과 저장 (Favorite)
      ========================= */
      await Favorite.create({
        userID,
        title:
          matchedDrug?.["품목명"] ||
          question ||
          "이미지 분석 결과",
        content: {
          answer,
          mode,
          drugFromDB: matchedDrug || null,
          ocrText,
        },
      });

      return res.json({
        answer,
        meta: {
          mode,
          imageUploaded: !!imageFile,
          ocrSuccess: !!ocrText,
          dbMatched: !!matchedDrug,
        },
      });
    } catch (err) {
      console.error("GPT MEDICAL ERROR:", err);
      return res.status(500).json({
        answer: "서버 오류가 발생했습니다.",
      });
    }
  }
);

export default router;
