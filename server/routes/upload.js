// routes/upload.js
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// 단일 파일 업로드
router.post("/image", verifyToken, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "파일이 없습니다." });
  }

  // 파일 경로만 프론트에 전달 (7일 이후 삭제 예정)
  res.status(201).json({
    filename: req.file.filename,
    path: req.file.path
  });
});

export default router;
