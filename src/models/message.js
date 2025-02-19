import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const messageSchema = mongoose.model("message", MessageSchema);
