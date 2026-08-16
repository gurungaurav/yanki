import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // Without this the contact form captured no reply address, so every
  // enquiry arrived with no way to answer it.
  email: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const messageSchema = mongoose.model("message", MessageSchema);
