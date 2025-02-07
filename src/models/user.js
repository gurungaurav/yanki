import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNo: { type: String, required: true },
  address: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

export const userSchema = mongoose.model("User", UserSchema);
