// routes/schedule.js
import express from "express";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import Schedule from "../models/Schedule.js";
import User from "../models/User.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

/*******************************************
 * 날짜별 복용 기록 조회 (userID 기준)
 *******************************************/
router.get("/", verifyToken, async (req, res) => {
  try {
    const date = req.query.date;
    const target = req.query.target; // 보호자가 조회할 때
    const userID = target || req.user.userID;

    const schedules = await Schedule.find({ userID });

    let list = [];

    schedules.forEach((s) => {
      const rec = s.records.find((r) => r.date === date);

      if (rec) {
        list.push({
          schedule_id: s.schedule_id,
          m_name: s.m_name,
          planned_time: s.planned_time,
          record_id: rec.record_id,
          date: rec.date,
          items: rec.items,
        });
      }
    });

    return res.json({ data: list });
  } catch (err) {
    console.error("GET /schedule error:", err);
    res.status(500).json({ success: false });
  }
});

/*******************************************
 * 스케줄 생성 + 날짜별 기록 자동 생성
 *******************************************/
router.post("/", verifyToken, async (req, res) => {
  try {
    const userID = req.user.userID;

    const {
      m_name,
      start_date,
      end_date,
      cycle,
      method,
      per_day,
      planned_time, // ["08:00", "20:00"]
    } = req.body;

    const s = dayjs(start_date);
    const e = dayjs(end_date);

    let records = [];

    for (let d = s; d.isBefore(e) || d.isSame(e); d = d.add(1, "day")) {
      const items = planned_time.map((t) => ({
        time: t,
        actual_time: null,
        status: null,
      }));

      records.push({
        record_id: uuid(),
        date: d.format("YYYY-MM-DD"),
        items,
      });
    }

    await Schedule.create({
      schedule_id: uuid(),
      userID,
      m_name,
      start_date,
      end_date,
      cycle,
      method,
      per_day,
      planned_time,
      records,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("POST /schedule error:", err);
    res.status(500).json({ success: false });
  }
});

/*******************************************
 * 스케줄 수정
 *******************************************/
router.put("/", verifyToken, async (req, res) => {
  try {
    const userID = req.user.userID;
    const data = req.body;

    const schedule = await Schedule.findOne({
      userID,
      schedule_id: data.schedule_id,
    });

    if (!schedule) return res.status(404).json({ message: "스케줄 없음" });

    // 수정 가능한 필드들
    schedule.m_name = data.m_name;
    schedule.start_date = data.start_date;
    schedule.end_date = data.end_date;
    schedule.cycle = data.cycle;
    schedule.method = data.method;
    schedule.per_day = data.per_day;
    schedule.planned_time = data.planned_time;

    await schedule.save();

    return res.json({ success: true });
  } catch (err) {
    console.error("PUT /schedule error:", err);
    res.status(500).json({ success: false });
  }
});

/*******************************************
 * 복용 처리 (status=1)
 *******************************************/
router.post("/record/take", verifyToken, async (req, res) => {
  try {
    const { schedule_id, date, time } = req.body;
    const userID = req.user.userID;

    const schedule = await Schedule.findOne({ userID, schedule_id });
    if (!schedule) return res.status(404).json({ message: "스케줄 없음" });

    const rec = schedule.records.find((r) => r.date === date);
    if (!rec) return res.status(404).json({ message: "레코드 없음" });

    const item = rec.items.find((i) => i.time === time);
    if (!item) return res.status(404).json({ message: "해당 시간 없음" });

    item.status = 1;
    item.actual_time = new Date().toISOString();

    await schedule.save();
    return res.json({ success: true });
  } catch (err) {
    console.error("POST /record/take error:", err);
    res.status(500).json({ success: false });
  }
});

/*******************************************
 * 복용 취소 (status=null)
 *******************************************/
router.post("/record/cancel", verifyToken, async (req, res) => {
  try {
    const { schedule_id, date, time } = req.body;
    const userID = req.user.userID;

    const schedule = await Schedule.findOne({ userID, schedule_id });
    if (!schedule) return res.status(404).json({ message: "스케줄 없음" });

    const rec = schedule.records.find((r) => r.date === date);
    if (!rec) return res.status(404).json({ message: "레코드 없음" });

    const item = rec.items.find((i) => i.time === time);
    if (!item) return res.status(404).json({ message: "해당 시간 없음" });

    item.status = null;
    item.actual_time = null;

    await schedule.save();
    return res.json({ success: true });
  } catch (err) {
    console.error("POST /record/cancel error:", err);
    res.status(500).json({ success: false });
  }
});

export default router;
