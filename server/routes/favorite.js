// routes/favorite.js
import express from "express";
import Favorite from "../models/Favorite.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* =========================
   즐겨찾기 저장 (최대 8개)
========================= */
router.post("/", verifyToken, async (req, res) => {
  console.log("⭐ FAVORITE USER:", req.user);
  try {
    const userID =
      req.user.userID ||
      req.user.id ||
      req.user.email ||
      null;

    console.log("⭐ FAVORITE USER:", req.user);  

    if (!userID) {
      return res.status(401).json({
        message: "사용자 식별 실패",
      });
    }

    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({
        message: "잘못된 요청",
      });
    }

    const exists = await Favorite.findOne({ userID, title });
    
    if (exists) {
      return res.json({
        duplicated: true,
        message: "이미 즐겨찾기에 저장된 항목입니다.",
      });
    }

    // ✅ 유저 기준으로만 카운트
    const count = await Favorite.countDocuments({ userID });

    if (count >= 8) {
      return res.status(400).json({
        message: "즐겨찾기는 8개 까지 가능합니다!",
      });
    }

    const created = await Favorite.create({
      userID,
      title,
      content,
    });

    return res.json({
      duplicated: false,      
      message: "즐겨찾기에 저장되었습니다!",
      item: created,
    });
  } catch (err) {
    console.error("FAVORITE SAVE ERROR:", err);
    return res.status(500).json({
      message: "즐겨찾기 저장 실패",
    });
  }
});

/* =========================
   즐겨찾기 목록
========================= */
router.get("/", verifyToken, async (req, res) => {
  const userID =
    req.user.userID ||
    req.user.id ||
    req.user.email ||
    null;

  if (!userID) {
    return res.status(401).json({ message: "사용자 식별 실패" });
  }

  const list = await Favorite.find({ userID })
    .sort({ createdAt: -1 })
    .select("_id title createdAt");

  res.json(list);
});

/* =========================
   즐겨찾기 상세
========================= */
router.get("/:id", verifyToken, async (req, res) => {
  const userID =
    req.user.userID ||
    req.user.id ||
    req.user.email ||
    null;

  const item = await Favorite.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ message: "Not found" });
  }

  if (item.userID !== userID) {
    return res.status(403).json({ message: "권한 없음" });
  }

  res.json(item);
});

/* =========================
   즐겨찾기 삭제
========================= */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const userID =
      req.user.userID ||
      req.user.id ||
      req.user.email ||
      null;

    if (!userID) {
      return res.status(401).json({ message: "사용자 식별 실패" });
    }

    const item = await Favorite.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }

    if (item.userID !== userID) {
      return res.status(403).json({ message: "권한 없음" });
    }

    await Favorite.deleteOne({ _id: req.params.id });

    return res.json({ message: "삭제 완료" });
  } catch (err) {
    console.error("FAVORITE DELETE ERROR:", err);
    return res.status(500).json({ message: "삭제 실패" });
  }
});


export default router;
