import mongoose from "mongoose";

export function connectMongo() {
  mongoose
    .connect("mongodb://127.0.0.1:27017/soft1test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));
}
