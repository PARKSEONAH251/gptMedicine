// routes/family.js
import express from "express";
import crypto from "crypto";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireProtector } from "../middleware/requireProtector.js";
import Family from "../models/Family.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const router = express.Router();

/* =====================================================
   유틸: 고유 family_id 생성 (중복 방지)
===================================================== */
async function generateFamilyId() {
  while (true) {
    const id = crypto.randomBytes(6).toString("hex"); // 12 hex
    const exists = await Family.exists({ family_id: id });
    if (!exists) return id;
  }
}

/* =====================================================
   1. 가족(그룹) 생성
   - 현재 스키마 기준: 유저는 1개 그룹만 소속 가능
===================================================== */
router.post("/create", verifyToken, async (req, res) => {
  try {
    const userID = req.user.userID;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "그룹명을 입력하세요." });
    }

    const user = await User.findOne({ userID });
    if (!user) return res.status(404).json({ message: "유저 없음" });

    if (user.family_id) {
      return res.status(400).json({ message: "이미 그룹에 속해 있습니다." });
    }

    const family_id = await generateFamilyId();

    await Family.create({
      family_id,
      name,
      leader_id: userID,
      members: [userID],
      locked: [],
      invites: []
    });

    user.family_id = family_id;
    user.role = "protector";
    await user.save();

    res.status(201).json({ family_id, name });
  } catch (err) {
    console.error("Family Create Error:", err);
    res.status(500).json({ message: "그룹 생성 실패" });
  }
});

/* =====================================================
   2. 가족 정보 조회 (마이페이지용)
   - 프론트 기대 형태: { groups: [ { family_id, name, leader_id, members:[...] } ] }
   - 현재 스키마는 user.family_id 하나만 존재 → groups 배열 길이는 0 또는 1
===================================================== */
router.get("/me", verifyToken, async (req, res) => {
  try {
    const userID = req.user.userID;

    const user = await User.findOne({ userID }).lean();
    if (!user || !user.family_id) {
      // 어떤 그룹에도 속해 있지 않음
      return res.json({ groups: [] });
    }

    const family = await Family.findOne({ family_id: user.family_id }).lean();
    if (!family) {
      // family 문서가 사라진 경우 사용자 상태 초기화 고려 가능
      return res.json({ groups: [] });
    }

    // members: [ "userID1", "userID2", ... ]
    const memberUserIDs = family.members || [];
    const memberUsers = await User.find(
      { userID: { $in: memberUserIDs } },
      { _id: 0, userID: 1, name: 1 }
    ).lean();

    const lockedSet = new Set(family.locked || []);

    const members = memberUsers.map((u) => ({
      userID: u.userID,
      name: u.name || u.userID,
      locked: lockedSet.has(u.userID),
    }));

    const groupDto = {
      family_id: family.family_id,
      name: family.name,
      leader_id: family.leader_id,
      members,
    };

    res.json({ groups: [groupDto] });
  } catch (err) {
    console.error("Family Me Error:", err);
    res.status(500).json({ message: "가족 정보 조회 실패" });
  }
});

/* =====================================================
   3. 초대 보내기 (Invite → Family.invites)
   - body: { target_id }
   - requireProtector: 보호자만 가능
===================================================== */
router.post("/invite", verifyToken, requireProtector, async (req, res) => {
  try {
    const inviter_id = req.user.userID;
    const { target_id } = req.body;

    if (!target_id) {
      return res.status(400).json({ message: "target_id 필요" });
    }

    const inviter = await User.findOne({ userID: inviter_id });
    const target = await User.findOne({ userID: target_id });

    if (!inviter || !target) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    if (!inviter.family_id) {
      return res.status(400).json({ message: "그룹이 없습니다." });
    }

    if (target.family_id) {
      return res.status(400).json({ message: "이미 다른 그룹에 속한 유저입니다." });
    }

    const family = await Family.findOne({ family_id: inviter.family_id });
    if (!family) {
      return res.status(404).json({ message: "그룹 없음" });
    }

    // 중복 초대 방지
    const exists = family.invites.some((inv) => inv.target_id === target_id);
    if (exists) {
      return res.status(400).json({ message: "이미 초대한 유저입니다." });
    }

    family.invites.push({
      target_id,
      inviter_id,
      createdAt: new Date(),
    });

    await family.save();

    res.status(201).json({ message: "초대 전송 완료" });
  } catch (err) {
    console.error("Invite Error:", err);
    res.status(500).json({ message: "초대 전송 실패" });
  }
});

/* =====================================================
   4. 내가 받은 초대 목록 (메인화면 팝업용)
===================================================== */
router.get("/invites", verifyToken, async (req, res) => {
  try {
    const userID = req.user.userID;

    const families = await Family.find(
      { "invites.target_id": userID },
      {
        _id: 0,
        family_id: 1,
        name: 1,
        invites: { $elemMatch: { target_id: userID } },
      }
    ).lean();

    res.json(families || []);
  } catch (err) {
    console.error("Invites Error:", err);
    res.status(500).json({ message: "초대 조회 실패" });
  }
});

/* =====================================================
   5. 초대 수락
===================================================== */
router.post("/invite/accept", verifyToken, async (req, res) => {
  try {
    const userID = req.user.userID;
    const { family_id } = req.body;

    const user = await User.findOne({ userID });
    if (!user) return res.status(404).json({ message: "유저 없음" });

    if (user.family_id) {
      return res.status(400).json({ message: "이미 다른 그룹에 속해 있습니다." });
    }

    const updated = await Family.findOneAndUpdate(
      { family_id, "invites.target_id": userID },
      {
        $addToSet: { members: userID },
        $pull: { invites: { target_id: userID } },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(400).json({ message: "유효하지 않은 초대" });
    }

    user.family_id = family_id;
    user.role = "dependent";
    await user.save();

    res.json({ message: "그룹에 가입되었습니다." });
  } catch (err) {
    console.error("Invite Accept Error:", err);
    res.status(500).json({ message: "초대 수락 실패" });
  }
});

/* =====================================================
   6. 초대 거절
===================================================== */
router.post("/invite/reject", verifyToken, async (req, res) => {
  try {
    const userID = req.user.userID;
    const { family_id } = req.body;

    const family = await Family.findOne({ family_id });
    if (!family) {
      return res.status(404).json({ message: "그룹 없음" });
    }

    family.invites = family.invites.filter((inv) => inv.target_id !== userID);
    await family.save();

    res.json({ message: "초대를 거절했습니다." });
  } catch (err) {
    console.error("Invite Reject Error:", err);
    res.status(500).json({ message: "초대 거절 실패" });
  }
});

/* =====================================================
   7. 그룹 탈퇴 (구성원)
===================================================== */
router.post("/leave", verifyToken, async (req, res) => {
  try {
    const userID = req.user.userID;

    const user = await User.findOne({ userID });
    if (!user || !user.family_id) {
      return res.status(400).json({ message: "그룹에 속해 있지 않습니다." });
    }

    const family = await Family.findOne({ family_id: user.family_id });
    if (!family) {
      user.family_id = null;
      user.role = "self";
      await user.save();
      return res.json({ message: "그룹 정보 정리 완료" });
    }

    if (family.locked.includes(userID)) {
      return res.status(403).json({ message: "잠금된 계정입니다." });
    }

    if (family.leader_id === userID) {
      return res.status(403).json({ message: "보호자는 그룹을 탈퇴할 수 없습니다." });
    }

    family.members = family.members.filter((m) => m !== userID);
    await family.save();

    user.family_id = null;
    user.role = "self";
    await user.save();

    res.json({ message: "그룹 탈퇴 완료" });
  } catch (err) {
    console.error("Leave Group Error:", err);
    res.status(500).json({ message: "그룹 탈퇴 실패" });
  }
});

/* =====================================================
   8. 보호자: 구성원 잠금/해제
   - body: { target_id, lock }
===================================================== */
router.post("/lock", verifyToken, async (req, res) => {
  const leaderID = req.user.userID;
  const { family_id, target_id, lock } = req.body;

  if (!family_id || !target_id) {
    return res.status(400).json({ message: "파라미터 누락" });
  }

  const family = await Family.findOne({ family_id });

  if (!family) {
    return res.status(404).json({ message: "그룹 없음" });
  }

  if (family.leader_id !== leaderID) {
    return res.status(403).json({ message: "권한 없음" });
  }

  if (!family.members.includes(target_id)) {
    return res.status(404).json({ message: "구성원 아님" });
  }

  if (lock) {
    if (!family.locked.includes(target_id)) {
      family.locked.push(target_id);
    }
  } else {
    family.locked = family.locked.filter((id) => id !== target_id);
  }

  await family.save();

  res.json({ message: lock ? "잠금 설정" : "잠금 해제" });
});


/* =====================================================
   9. 그룹 삭제 (보호자만)
===================================================== */
router.delete("/delete", verifyToken, async (req, res) => {
  try {
    const leaderID = req.user.userID;

    const leader = await User.findOne({ userID: leaderID });
    if (!leader || !leader.family_id) {
      return res.status(400).json({ message: "그룹 없음" });
    }

    const family = await Family.findOne({ family_id: leader.family_id });
    if (!family || family.leader_id !== leaderID) {
      return res.status(403).json({ message: "권한 없음" });
    }

    await User.updateMany(
      { family_id: family.family_id },
      { $set: { family_id: null, role: "self" } }
    );

    await Family.deleteOne({ family_id: family.family_id });

    res.json({ message: "그룹 삭제 완료" });
  } catch (err) {
    console.error("Delete Group Error:", err);
    res.status(500).json({ message: "그룹 삭제 실패" });
  }
});

/* =====================================================
   10. 구성원 강퇴 (kick) – 보호자만
   - body: { family_id, member_id }
===================================================== */
router.post("/kick", verifyToken, async (req, res) => {
  try {
    const leaderID = req.user.userID;
    const { family_id, member_id } = req.body;

    const leader = await User.findOne({ userID: leaderID });
    if (!leader || !leader.family_id) {
      return res.status(400).json({ message: "그룹 없음" });
    }

    const family = await Family.findOne({ family_id: leader.family_id });
    if (!family || family.leader_id !== leaderID) {
      return res.status(403).json({ message: "권한 없음" });
    }

    if (!family.members.includes(member_id)) {
      return res.status(404).json({ message: "구성원 아님" });
    }

    if (member_id === leaderID) {
      return res.status(400).json({ message: "관리자는 스스로를 삭제할 수 없습니다." });
    }

    family.members = family.members.filter((m) => m !== member_id);
    family.locked = family.locked.filter((id) => id !== member_id);
    await family.save();

    await User.updateOne(
      { userID: member_id, family_id: family.family_id },
      { $set: { family_id: null, role: "self" } }
    );

    res.json({ message: "구성원을 삭제했습니다." });
  } catch (err) {
    console.error("Kick Member Error:", err);
    res.status(500).json({ message: "구성원 삭제 실패" });
  }
});

export default router;
