import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js"

const app = express();
app.use(cors());
app.use(express.json());

// API 라우팅
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
