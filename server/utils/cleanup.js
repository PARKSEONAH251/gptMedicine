// utils/cleanup.js
import fs from "fs";
import path from "path";
import { UPLOAD_DIR } from "../middleware/upload.js";

const DAYS = 7;
const now = Date.now();
const cutoff = now - DAYS * 24 * 60 * 60 * 1000;

fs.readdir(UPLOAD_DIR, (err, files) => {
  if (err) {
    console.error("Upload dir read error:", err);
    process.exit(1);
  }

  files.forEach((file) => {
    const filePath = path.join(UPLOAD_DIR, file);
    fs.stat(filePath, (err2, stats) => {
      if (err2) return;
      if (stats.mtimeMs < cutoff) {
        fs.unlink(filePath, () => {});
      }
    });
  });
});
