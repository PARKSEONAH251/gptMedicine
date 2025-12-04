import jwt from "jsonwebtoken";

const JWT_SECRET = "YOUR_SECRET_KEY";

export default function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "토큰 없음" });

  const token = header.split(" ")[1];

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    return res.status(403).json({ message: "토큰 검증 실패" });
  }
}
