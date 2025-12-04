//routes/user.js
import express from "express";
import User from "../models/User.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// 보호자가 member 추가
router.post("/add-member", verifyToken, async (req, res) => {
  const protectorId = req.user.user_id;
  const { memberId } = req.body;

  const protector = await User.findById(protectorId);
  if (protector.role !== "protector")
    return res.status(403).json({ message: "관리자만 가능" });

  protector.members.push(memberId);
  await protector.save();

  const member = await User.findById(memberId);
  member.protector_id = protectorId;
  await member.save();

  res.json({ success: true });
});

export default router;
