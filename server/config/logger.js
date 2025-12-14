// config/logger.js
import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";
import fs from "fs";

const logDir = "logs";
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const transport = new winston.transports.DailyRotateFile({
  dirname: logDir,
  filename: "server-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: false,
  maxSize: "20m",
  maxFiles: "14d"
});

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [transport, new winston.transports.Console()]
});
