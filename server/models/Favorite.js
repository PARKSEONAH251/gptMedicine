// models/Favorite.js
import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true, index: true },
    title: String,
    content: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model("Favorite", FavoriteSchema);