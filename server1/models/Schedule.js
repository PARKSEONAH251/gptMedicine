// models/Schedule.js
import mongoose from "mongoose";

// 하루 복용 패턴을 담는 Sub Schema
const RecordItemSchema = new mongoose.Schema(
  {
    time: String,        // 예정 시간 "08:00"
    actual_time: String, // 실제 복용 시간 ISO 문자열
    status: Number,      // null=미기록, 0=미복용, 1=복용
  },
  { _id: false }
);

// 날짜 단위 기록
const RecordSchema = new mongoose.Schema(
  {
    record_id: { type: String, required: true }, // uuid
    date: { type: String, required: true },      // YYYY-MM-DD
    items: [RecordItemSchema],
  },
  { _id: false }
);

// 스케줄 (약 하나에 대한 전체 계획)
const ScheduleSchema = new mongoose.Schema(
  {
    schedule_id: { type: String, required: true, unique: true }, // uuid

    // 어떤 유저의 스케줄인가?
    userID: { type: String, required: true },

    // 약 정보
    m_name: { type: String, required: true },
    start_date: { type: String, required: true },
    end_date: { type: String, default: null },
    cycle: { type: String, required: true },
    method: { type: String, required: true },

    // 하루 복용 횟수 (예: 2회)
    per_day: { type: Number, default: 1 },

    // 예정 시간 예: ["08:00", "20:00"]
    planned_time: [String],

    // 날짜별 복용 기록 전체
    records: [RecordSchema],
  },
  { timestamps: true }
);

// 검색 최적화
ScheduleSchema.index({ userID: 1 });
ScheduleSchema.index({ userID: 1, schedule_id: 1 });

export default mongoose.model("Schedule", ScheduleSchema);
