import express from "express";
import User from "../models/User.js";
import UserAuth from "../models/UserAuth.js";

import { signToken } from "../utils/jwt.js";
import { hashPassword, generateSalt } from "../utils/password.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
const MAX_FAIL = 5;

/* =========================
   ID 중복 체크
========================= */
router.get("/check-id", async (req, res) => {
  try {
    const { userID } = req.query;

    if (!userID) {
      return res.status(400).json({ available: false });
    }

    const exists = await User.findOne({ userID });
    res.json({ available: !exists });
  } catch (err) {
    console.error("Check ID Error:", err);
    res.status(500).json({ available: false });
  }
});

/* =========================
   회원가입
========================= */
router.post("/signup", async (req, res) => {
  try {
    const { userID, password, name, email, phone_num } = req.body;

    if (!userID || !password) {
      return res.status(400).json({ message: "필수 값 누락" });
    }

    const exists = await User.findOne({ userID });
    if (exists) {
      return res.status(409).json({ message: "이미 존재하는 ID입니다." });
    }

    const salt = generateSalt();
    const password_hash = hashPassword(password, salt);

    await User.create({
      userID,
      name,
      email,
      phone_num,
      role: "self",
      family_id: null
    });

    await UserAuth.create({
      userID,
      password_hash,
      salt,
      login_fail_count: 0,
      login_locked: false
    });

    res.status(201).json({ message: "회원가입 완료" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "회원가입 실패" });
  }
});

/* =========================
   로그인
========================= */
router.post("/login", async (req, res) => {
  try {
    const { userID, password } = req.body;

    const user = await User.findOne({ userID });
    const auth = await UserAuth.findOne({ userID });

    if (!user || !auth) {
      return res.status(401).json({ message: "아이디 또는 비밀번호 오류" });
    }

    if (auth.login_locked) {
      return res.status(403).json({ message: "계정이 잠겼습니다." });
    }

    const hashed = hashPassword(password, auth.salt);

    if (hashed !== auth.password_hash) {
      auth.login_fail_count += 1;
      if (auth.login_fail_count >= MAX_FAIL) {
        auth.login_locked = true;
      }
      await auth.save();
      return res.status(401).json({ message: "아이디 또는 비밀번호 오류" });
    }

    auth.login_fail_count = 0;
    await auth.save();

    await User.updateOne(
      { userID },
      { last_login: new Date() }
    );

    const token = signToken(userID);

    // ⭐ RN용 핵심 응답
    res.json({
      token,
      user: {
        userID: user.userID,
        name: user.name,
        role: user.role,
        family_id: user.family_id
      }
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "로그인 실패" });
  }
});

/* =========================
   비밀번호 변경
========================= */
router.post("/change-password", verifyToken, async (req, res) => {
  try {
    const userID = req.user.userID;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "필수 값 누락" });
    }

    const auth = await UserAuth.findOne({ userID });
    if (!auth) {
      return res.status(404).json({ message: "유저 인증 정보 없음" });
    }

    // 기존 비밀번호 확인
    const oldHash = hashPassword(oldPassword, auth.salt);
    if (oldHash !== auth.password_hash) {
      return res.status(400).json({ message: "기존 비밀번호가 틀렸습니다." });
    }

    // 새로운 비밀번호 저장
    const newSalt = generateSalt();
    const newHash = hashPassword(newPassword, newSalt);

    auth.salt = newSalt;
    auth.password_hash = newHash;
    await auth.save();

    res.json({ message: "비밀번호가 변경되었습니다." });
  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(500).json({ message: "비밀번호 변경 실패" });
  }
});


/* =========================
   내 정보
========================= */
router.get("/me", verifyToken, async (req, res) => {
  const user = await User.findOne(
    { userID: req.user.userID },
    "-_id -__v"
  ).lean();

  if (!user) {
    return res.status(404).json({ message: "유저 없음" });
  }

  res.json(user);
});

export default router;
