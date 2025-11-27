// /home/forserver2/routes/user.js
import express from "express";
import { jwtVerify } from "../middleware/jwtVerify.js";
import { success } from "../utils/response.js";

const router = express.Router();

// 간단 예시: 토큰 안에 있는 정보 그대로 반환
router.get("/me", jwtVerify, (req, res) => {
  const { member_id, userID } = req.user;
  return success(res, "내 정보", { member_id, userID });
});

export default router;
