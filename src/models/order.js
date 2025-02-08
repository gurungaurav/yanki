import mongoose from "mongoose";

// Order Schema
const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  orderDate: { type: Date, default: Date.now },
  orderStatus: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
});

export const orderSchema = mongoose.model("orders", OrderSchema);
