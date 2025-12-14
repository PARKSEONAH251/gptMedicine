import express from "express";
import fs from "fs";
import path from "path";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
const FILE_PATH = path.resolve("./data/tempResults.json");

router.post("/", verifyToken, (req, res) => {
  const { question, answer } = req.body;
  const userID = req.user.userID;

  const record = {
    userID,
    question,
    answer,
    createdAt: new Date().toISOString(),
  };

  let list = [];
  if (fs.existsSync(FILE_PATH)) {
    list = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
  }

  list.push(record);
  fs.writeFileSync(FILE_PATH, JSON.stringify(list, null, 2));

  res.json({ success: true });
});

export default router;
