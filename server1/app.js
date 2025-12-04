import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import scheduleRoutes from "./routes/schedule.js";
import userRoutes from "./routes/user.js";

const app = express();
const PORT = 2803;

mongoose
  .connect("mongodb://localhost:27017/gpt", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB 연결됨"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/user", userRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
