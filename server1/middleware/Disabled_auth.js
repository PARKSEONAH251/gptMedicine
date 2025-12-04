import jwt from "jsonwebtoken";

const SECRET_KEY = "YOUR_SECRET_KEY_CHANGE_THIS";

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) return res.status(401).json({ msg: "No token" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // { id: "user123" }
    next();
  } catch (e) {
    return res.status(403).json({ msg: "Invalid token" });
  }
}
