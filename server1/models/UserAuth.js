// models/UserAuth.js
import mongoose from "mongoose";

const UserAuthSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true, unique: true }, // 로그인 ID
    password: { type: String, required: true },
    salt: { type: String, required: true },
    login_locked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("UserAuth", UserAuthSchema);
