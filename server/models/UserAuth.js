import mongoose from "mongoose";

const UserAuthSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    salt: { type: String, required: true },

    login_fail_count: { type: Number, default: 0 }, 
    login_locked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("UserAuth", UserAuthSchema);
