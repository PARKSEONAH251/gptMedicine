// middleware/requireLeader.js
import User from "../models/User.js";
import Family from "../models/Family.js";

export async function requireLeader(req, res, next) {
  const userID = req.user.userID;
  const user = await User.findOne({ userID }).lean();
  if (!user?.family_id) return res.status(400).json({ message: "그룹 없음" });

  const family = await Family.findOne({ family_id: user.family_id }).lean();
  if (!family || family.leader_id !== userID) {
    return res.status(403).json({ message: "권한 없음" });
  }

  req.family = family; // 다음 미들웨어/라우트에서 재사용 가능
  next();
}
