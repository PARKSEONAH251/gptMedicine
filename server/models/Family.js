// models/Family.js
import mongoose from "mongoose";

const InviteSchema = new mongoose.Schema(
  {
    target_id: { type: String, required: true },
    inviter_id: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const FamilySchema = new mongoose.Schema(
  {
    family_id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },

    leader_id: { type: String, required: true, index: true },

    members: { type: [String], default: [] },
    locked: { type: [String], default: [] },

    invites: { type: [InviteSchema], default: [] }
  },
  { timestamps: true }
);

// 자주 쓰는 조회 최적화
FamilySchema.index({ "invites.target_id": 1 });
FamilySchema.index({ family_id: 1, leader_id: 1 });

export default mongoose.model("Family", FamilySchema);
