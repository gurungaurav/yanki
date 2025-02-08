import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "orders",
    required: true,
  },
  paymentMethod: { type: String, required: true },
  paymentDate: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
});

export const paymentSchema = mongoose.model("payments", PaymentSchema);
