// models/ScheduleLog.js
import mongoose from "mongoose";

const ScheduleLogSchema = new mongoose.Schema(
  {
    schedule_id: { type: String, required: true },
    userID: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    timeIndex: { type: Number, required: true },
    planned_time: String,
    status: { type: Number, default: null }, // null / 0 / 1
    actual_time: String
  },
  { timestamps: true }
);

ScheduleLogSchema.index({ userID: 1, date: 1 });
ScheduleLogSchema.index({ schedule_id: 1 });

export default mongoose.model("ScheduleLog", ScheduleLogSchema);
