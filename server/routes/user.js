// routes/user.js
import express from "express";
import User from "../models/User.js";
import Family from "../models/Family.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// 내 정보 조회
router.get("/me", verifyToken, async (req, res) => {
  const userID = req.user.userID;
  const user = await User.findOne({ userID }).lean();
  if (!user) return res.status(404).json({ message: "유저 없음" });

  let family = null;
  if (user.family_id) {
    family = await Family.findOne({ family_id: user.family_id }).lean();
  }

  res.json({ user, family });
});

export default router;
