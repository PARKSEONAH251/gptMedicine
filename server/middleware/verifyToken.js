// middleware/verifyToken.js
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "토큰 없음" });

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "토큰 만료" });
  }
}
