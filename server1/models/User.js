// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // 유저 고유 ID (UserAuth.userID와 동일하게 사용)
    userID: { type: String, required: true, unique: true },

    // 역할: member / protector
    role: { type: String, default: "member" },

    // 보호자인 경우: 자신(userID)
    // 피보호자인 경우: 자신을 관리하는 보호자 userID
    protector_id: { type: String, default: null },

    // 보호자인 경우: 내가 관리하는 멤버 목록
    members: [{ type: String }],

    // 추가 정보
    sns: { type: Boolean, default: false },
    email: { type: String, default: null },
    phone_num: { type: String, default: null },

    join_date: { type: Date, default: Date.now },
    last_login: { type: Date, default: null },
  },
  { timestamps: true }
);

// 조회 속도 향상을 위한 인덱스
UserSchema.index({ userID: 1 });
UserSchema.index({ protector_id: 1 });

export default mongoose.model("User", UserSchema);
