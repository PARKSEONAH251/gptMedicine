// routes/schedule.js
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import Schedule from "../models/Schedule.js";
import ScheduleLog from "../models/ScheduleLog.js";
import crypto from "crypto";

const router = express.Router();

// 날짜 반복 생성 함수
function* dateRange(start, end) {
  const cur = new Date(start);
  const last = new Date(end);
  while (cur <= last) {
    yield cur.toISOString().substring(0, 10);
    cur.setDate(cur.getDate() + 1);
  }
}

// 스케줄 생성 + 로그 미리 생성
router.post("/create", verifyToken, async (req, res) => {
  const userID = req.user.userID;
  const { medicine_name, memo, start_date, end_date, per_day, planned_time } =
    req.body;

  const schedule_id = crypto.randomBytes(6).toString("hex");

  await Schedule.create({
    schedule_id,
    userID,
    medicine_name,
    memo,
    start_date,
    end_date,
    per_day,
    planned_time
  });

  const logs = [];
  let idx = 0;

  for (let d of dateRange(start_date, end_date)) {
    for (let i = 0; i < per_day; i++) {
      logs.push({
        schedule_id,
        userID,
        date: d,
        timeIndex: i,
        planned_time: planned_time[i] || null,
        status: null
      });
    }
  }

  if (logs.length) {
    await ScheduleLog.insertMany(logs);
  }

  res.status(201).json({ schedule_id });
});

// 스케줄 목록 (유저 기준)
router.get("/list", verifyToken, async (req, res) => {
  const userID = req.user.userID;
  const schedules = await Schedule.find({ userID }).lean();
  res.json(schedules);
});

// 특정 날짜 로그 조회 (캘린더용)
router.get("/logs", verifyToken, async (req, res) => {
  const userID = req.user.userID;
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ message: "date 쿼리 필요 (YYYY-MM-DD)" });
  }

  const logs = await ScheduleLog.find({ userID, date }).lean();
  res.json(logs);
});

// 복용 상태 토글
router.post("/logs/toggle", verifyToken, async (req, res) => {
  const userID = req.user.userID;
  const { log_id } = req.body;

  const log = await ScheduleLog.findById(log_id);
  if (!log || log.userID !== userID) {
    return res.status(404).json({ message: "로그를 찾을 수 없습니다." });
  }

  if (log.status === 1) {
    log.status = 0;
    log.actual_time = null;
  } else {
    log.status = 1;
    log.actual_time = new Date().toISOString().substring(11, 19);
  }

  await log.save();
  res.json(log);
});

// 스케줄 삭제 (로그는 남김)
router.delete("/:schedule_id", verifyToken, async (req, res) => {
  const userID = req.user.userID;
  const { schedule_id } = req.params;

  const schedule = await Schedule.findOne({ schedule_id, userID });
  if (!schedule) {
    return res.status(404).json({ message: "스케줄 없음" });
  }

  await Schedule.deleteOne({ schedule_id, userID });

  // 요구사항: 로그는 그대로 남김
  res.json({ message: "스케줄 삭제 (로그는 유지됨)" });
});

export default router;
