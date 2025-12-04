// routes/auth.js
import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import UserAuth from "../models/UserAuth.js";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = "YOUR_SECRET_KEY";

// 회원가입
router.post("/signup", async (req, res) => {
  try {
    const { userID, password } = req.body;

    if (!userID || !password)
      return res.status(400).json({ success: false, message: "필수 정보 누락" });

    // 이미 존재하는지 확인
    const exist = await UserAuth.findOne({ userID });
    if (exist)
      return res.status(409).json({ success: false, message: "이미 존재하는 아이디" });

    // 암호화
    const salt = crypto.randomBytes(16).toString("hex");
    const hashed = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");

    // UserAuth 생성 (로그인 계정)
    await UserAuth.create({
      userID,
      password: hashed,
      salt,
    });

    // User 생성 (유저 정보 + 가족 구조)
    await User.create({
      userID,
      role: "member",        // 기본 사용자
      protector_id: null,    // 기본 보호자 없음
      members: [],           // 내가 보호자인 경우 피보호자 목록
      sns: false,
      email: null,
      phone_num: null,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
});

// 로그인
router.post("/login", async (req, res) => {
  try {
    const { userID, password } = req.body;

    const auth = await UserAuth.findOne({ userID });
    if (!auth) return res.status(401).json({ success: false, message: "잘못된 정보" });

    // 비밀번호 검증
    const hashed = crypto
      .pbkdf2Sync(password, auth.salt, 1000, 64, "sha512")
      .toString("hex");

    if (hashed !== auth.password)
      return res.status(401).json({ success: false, message: "잘못된 정보" });

    // User 정보 불러오기
    const user = await User.findOne({ userID });
    if (!user) return res.status(500).json({ success: false, message: "계정 정보 손상" });

    // JWT 발급
    const token = jwt.sign(
      {
        userID: user.userID,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res.json({
      success: true,
      token,
      userID: user.userID,
      role: user.role,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
});

export default router;
