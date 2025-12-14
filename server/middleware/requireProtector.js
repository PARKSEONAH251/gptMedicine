import User from "../models/User.js";

export async function requireProtector(req, res, next) {
  const user = await User.findOne({ userID: req.user.userID });

  if (!user || user.role !== "protector") {
    return res.status(403).json({ message: "보호자 권한 필요" });
  }

  next();
}
