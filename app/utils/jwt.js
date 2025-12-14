import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = "7d"; // 모바일 기준

export function signToken(userID) {
  return jwt.sign(
    { userID },
    SECRET,
    { expiresIn: EXPIRES_IN }
  );
}

export function verifyTokenRaw(token) {
  return jwt.verify(token, SECRET);
}
