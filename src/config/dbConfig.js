import mongoose from "mongoose";
import { DATABASE_URL } from "../../secret.js";

export const db = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Db connected successfully");
  } catch (e) {
    console.log("error bish", e);
  }
};
