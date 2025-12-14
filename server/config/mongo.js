// config/mongo.js
import mongoose from "mongoose";
import { logger } from "./logger.js";

export async function connectMongo() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI not set in .env");
  }

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri);
    logger.info("MongoDB connected");
  } catch (err) {
    logger.error("MongoDB connection error", { error: err.message });
    process.exit(1);
  }
}
