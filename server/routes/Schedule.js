import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import Schedule from "../models/Schedule.js";
import ScheduleLog from "../models/ScheduleLog.js";
import Family from "../models/Family.js";
import mongoose from "mongoose";

const router = express.Router();

function* dateRange(start, end) {
  let cur = new Date(start + "T00:00:00Z");
  const last = new Date(end + "T00:00:00Z");

  while (cur <= last) {
    yield cur.toISOString().slice(0, 10);
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
}

function isValidCycle(dateStr, schedule) {
  const d = new Date(dateStr + "T00:00:00Z");

  if (schedule.cycle === "daily") return true;

  if (schedule.cycle === "weekly") {
    // weekdays 미지정 시 매주 동일 요일 개념으로 전부 허용
    if (!Array.isArray(schedule.weekdays) || schedule.weekdays.length === 0) {
      return true;
    }
    return schedule.weekdays.includes(d.getUTCDay());
  }

  return true;
}

router.post("/create", verifyToken, async (req, res) => {
  try {
    const owner_id = req.user.userID;

    const {
      medicine_name,
      start_date,
      end_date,
      times,
      cycle = "daily",
      weekdays = [],
      method
    } = req.body;

    if (!medicine_name || !start_date || !end_date || !Array.isArray(times) || times.length === 0) {
      return res.status(400).json({ message: "필수 항목 누락" });
    }

    const schedule = await Schedule.create({
      owner_id,
      family_id: req.user.family_id || null,
      medicine_name,
      start_date,
      end_date,
      times,
      cycle,
      weekdays,
      method,
      is_active: true
    });

    const logs = [];

    for (const date of dateRange(start_date, end_date)) {
      if (!isValidCycle(date, schedule)) continue;

      schedule.times.forEach((time, idx) => {
        logs.push({
          schedule_id: schedule._id.toString(),
          userID: owner_id,
          date,
          timeIndex: idx,
          planned_time: time,
          status: null
        });
      });
    }

    if (logs.length === 0) {
      await Schedule.deleteOne({ _id: schedule._id });
      return res.status(400).json({ message: "스케줄 로그 생성 실패" });
    }

    await ScheduleLog.insertMany(logs);

    res.status(201).json({
      schedule_id: schedule._id,
      log_count: logs.length
    });
  } catch (err) {
    console.error("schedule create error:", err);
    res.status(500).json({ message: "스케줄 생성 실패" });
  }
});

router.get("/all", verifyToken, async (req, res) => {
  const { targetUser } = req.query;

  const ownerID = targetUser || req.user.userID;

  const schedules = await Schedule.find({
    owner_id: ownerID,
    is_active: true
  }).lean();

  res.json(schedules);
});


router.get("/logs", verifyToken, async (req, res) => {
  const { date, targetUser } = req.query;

  if (!date) {
    return res.status(400).json({ message: "date required" });
  }

  const userID = targetUser || req.user.userID;

  const logs = await ScheduleLog.find({
    userID,
    date
  }).lean();

  if (!logs.length) {
    return res.json([]);
  }

  const scheduleIds = [...new Set(logs.map(l => l.schedule_id))];

  const schedules = await Schedule.find({
    _id: { $in: scheduleIds }
  })
    .select("_id medicine_name method")
    .lean();

  const scheduleMap = {};
  schedules.forEach(s => {
    scheduleMap[s._id.toString()] = s;
  });

  const merged = logs.map(log => ({
    ...log,
    medicine_name: scheduleMap[log.schedule_id]?.medicine_name || "",
    method: scheduleMap[log.schedule_id]?.method || ""
  }));

  res.json(merged);
});

router.post("/logs/toggle", verifyToken, async (req, res) => {
  const { log_id } = req.body;

  const log = await ScheduleLog.findById(log_id);
  if (!log || log.userID !== req.user.userID) {
    return res.status(403).json({ message: "권한 없음" });
  }

  log.status = log.status === 1 ? 0 : 1;
  await log.save();

  res.json(log);
});

router.put("/:id", verifyToken, async (req, res) => {
  const schedule = await Schedule.findById(req.params.id);
  if (!schedule) {
    return res.status(404).json({ message: "스케줄 없음" });
  }

  if (
    !schedule.family_id ||
    schedule.family_id.toString() !== req.user.family_id
  ) {
    return res.status(403).json({ message: "권한 없음" });
  }
  const {
    medicine_name,
    start_date,
    end_date,
    times,
    cycle,
    weekdays,
    method
  } = req.body;

  Object.assign(schedule, {
    medicine_name,
    start_date,
    end_date,
    times,
    cycle,
    weekdays,
    method
  });

  await schedule.save();

  await ScheduleLog.deleteMany({
    schedule_id: schedule._id.toString()
  });

  const logs = [];

  for (const date of dateRange(start_date, end_date)) {
    if (!isValidCycle(date, schedule)) continue;

    schedule.times.forEach((time, idx) => {
      logs.push({
        schedule_id: schedule._id.toString(),
        userID: schedule.owner_id,
        date,
        timeIndex: idx,
        planned_time: time,
        status: null
      });
    });
  }

  if (logs.length === 0) {
    return res.status(400).json({ message: "로그 재생성 실패" });
  }

  await ScheduleLog.insertMany(logs);

  res.json({ message: "스케줄 수정 완료" });
});

router.get("/:id", verifyToken, async (req, res) => {
  const schedule = await Schedule.findById(req.params.id).lean();
  if (!schedule) {
    return res.status(404).json({ message: "스케줄 없음" });
  }
  if (
    String(schedule.family_id) !== String(req.user.family_id) &&
    req.user.role !== "protector"
  ) {
    return res.status(403).json({ message: "권한 없음" });
  }
  res.json(schedule);
});

router.delete("/:id", verifyToken, async (req, res) => {
  const schedule = await Schedule.findById(req.params.id);
  if (!schedule) {
    return res.status(404).json({ message: "스케줄 없음" });
  }

  const family = await Family.findOne({
    _id: new mongoose.Types.ObjectId(req.user.family_id)
  });

  if (
    req.user.role === "dependent" &&
    family?.locked?.includes(req.user.userID)
  ) {
    return res.status(403).json({
      code: "SCHEDULE_LOCKED",
      message: "이 스케줄은 보호자에 의해 잠겨 있습니다"
    });
  }
  
  schedule.is_active = false;
  await schedule.save();

  await ScheduleLog.deleteMany({
    schedule_id: schedule._id.toString()
  });

  res.json({ message: "스케줄 삭제 완료" });
});

export default router;
