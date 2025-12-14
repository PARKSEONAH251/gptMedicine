//models/Schedule.js
import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema(
  {
    owner_id: { type: String, required: true }, // 실제 복용자
    family_id: { type: mongoose.Schema.Types.ObjectId, ref: "Family" },

    medicine_name: { type: String, required: true },

    start_date: { type: String, required: true }, // YYYY-MM-DD
    end_date: { type: String },

    times: { type: [String], default: [] }, // ["08:00","13:00"]

    cycle: {
      type: String,
      enum: ["daily", "weekly"],
      default: "daily"
    },

    // weekly일 때만 사용 (0=일 ~ 6=토)
    weekdays: { type: [Number], default: [] },

    method: String, // 복용 방법
    is_active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Schedule", ScheduleSchema);
