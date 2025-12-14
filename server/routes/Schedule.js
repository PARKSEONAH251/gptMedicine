import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import Schedule from "../models/Schedule.js";
import ScheduleLog from "../models/ScheduleLog.js";
import Family from "../models/Family.js";
import mongoose from "mongoose";

const router = express.Router();

/* =========================
   날짜 유틸
========================= */
function* dateRange(start, end) {
  let cur = new Date(start + "T00:00:00Z");
  const last = new Date(end + "T00:00:00Z");

  while (cur <= last) {
    yield cur.toISOString().slice(0, 10);
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
}

/* =========================
   주기 판별 (Schedule 모델 기준)
========================= */
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

/* =========================
   스케줄 생성 + 로그 선생성
========================= */
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

    /* 1️⃣ Schedule 생성 */
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

    /* 2️⃣ ScheduleLog 선생성 */
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

  const ownerID =
    req.user.role === "protector" && targetUser
      ? targetUser
      : req.user.userID;

  const schedules = await Schedule.find({
    owner_id: ownerID,
    is_active: true
  }).lean();

    console.log(
    "[SCHEDULE LIST]",
    schedules.map(s => ({
      id: s._id,
      type: typeof s._id,
      string: s._id.toString()
    }))
  );

  res.json(schedules);
});

/* =========================
   특정 날짜 로그 조회 (캘린더 기준)
========================= */
router.get("/logs", verifyToken, async (req, res) => {
  const { date, targetUser } = req.query;

  const userID =
    req.user.role === "protector" && targetUser
      ? targetUser
      : req.user.userID;

  // 1️⃣ 로그 조회
  const logs = await ScheduleLog.find({
    userID,
    date
  }).lean();

  if (!logs.length) {
    return res.json([]);
  }

  // 2️⃣ schedule_id 수집
  const scheduleIds = [
    ...new Set(logs.map((l) => l.schedule_id))
  ];

  // 3️⃣ Schedule 조회
  const schedules = await Schedule.find({
    _id: { $in: scheduleIds }
  })
    .select("_id medicine_name method")
    .lean();

  const scheduleMap = {};
  schedules.forEach((s) => {
    scheduleMap[s._id.toString()] = s;
  });

  // 4️⃣ 로그에 medicine_name 합치기
  const merged = logs.map((log) => ({
    ...log,
    medicine_name:
      scheduleMap[log.schedule_id]?.medicine_name || "",
    method:
      scheduleMap[log.schedule_id]?.method || ""
  }));

  res.json(merged);
});


/* =========================
   복용 체크
========================= */
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

/* =========================
   스케줄 수정 → 로그 전면 재생성
========================= */
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

/* =========================
   스케줄 단건 조회 (수정 팝업용)
========================= */
router.get("/:id", verifyToken, async (req, res) => {
  const schedule = await Schedule.findById(req.params.id).lean();
  if (!schedule) {
    return res.status(404).json({ message: "스케줄 없음" });
  }

  // 같은 가족만 조회 가능
  if (
    String(schedule.family_id) !== String(req.user.family_id) &&
    req.user.role !== "protector"
  ) {
    return res.status(403).json({ message: "권한 없음" });
  }
  res.json(schedule);
});

/* =========================
   스케줄 삭제 (보호자 lock 반영)
========================= */
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
  

  // 스케줄 비활성화
  schedule.is_active = false;
  await schedule.save();

  //로그 전부 삭제 (cascade)
  await ScheduleLog.deleteMany({
    schedule_id: schedule._id.toString()
  });

  res.json({ message: "스케줄 삭제 완료" });
});

export default router;
