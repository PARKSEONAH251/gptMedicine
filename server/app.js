// app.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectMongo } from "./config/mongo.js";
import { logger } from "./config/logger.js";

import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import familyRouter from "./routes/family.js";
import scheduleRouter from "./routes/schedule.js";
import favoriteRouter from "./routes/favorite.js";
import uploadRouter from "./routes/upload.js";
import gptRouter from "./routes/gpt.js";
import tempResultRouter from "./routes/tempResult.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2803;

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

connectMongo();

// 헬스 체크
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 라우터 등록
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/family", familyRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/favorite", favoriteRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/gpt", gptRouter);
app.use("/api/temp-result", tempResultRouter);
app.use("/uploads", express.static("uploads"));

console.log({
  PORT: process.env.PORT,
  MONGO: !!process.env.MONGO_URI,
  JWT: !!process.env.JWT_SECRET,
  OPENAI: !!process.env.OPENAI_API_KEY,
});

app.listen(PORT, () => {
  logger.info(`API server running on port ${PORT}`);
  console.log(`API server running on port ${PORT}`);
});
