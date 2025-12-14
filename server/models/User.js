// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true, unique: true },

    role: {
      type: String,
      enum: ["self", "protector", "dependent"],
      default: "self"
    },

    family_id: { type: String, default: null },

    name: String,
    email: String,
    phone_num: String,

    join_date: { type: Date, default: Date.now },
    last_login: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
