// utils/password.js 
import crypto from "crypto";

export function hashPassword(password, salt) {
  return crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
}

export function generateSalt() {
  return crypto.randomBytes(16).toString("hex");
}

