import { Router } from "express";
import { successHandler } from "../handlers/success/successHandler.js";
import { userSchema } from "../models/user.js";
import { orderSchema } from "../models/order.js";
import { productSchema } from "../models/products.js";
import { paymentSchema } from "../models/payment.js";

export const adminRoutes = Router();

adminRoutes.use("/dashboard", async (req, res, next) => {
  const totalUsers = await userSchema.countDocuments();
  const totalOrders = await orderSchema.countDocuments();
  const totalProducts = await productSchema.countDocuments();

  // Find finished orders (shipped or delivered)
  const finishedOrders = await orderSchema.find({
    orderStatus: { $in: ["shipped", "delivered"] },
  });

  // Extract order IDs
  const orderIds = finishedOrders.map((order) => order._id);

  // Find payments related to the finished orders
  const payments = await paymentSchema.find({ orderId: { $in: orderIds } });

  // Calculate the total payment amount
  const totalAmount = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  successHandler(res, 200, {
    totalUsers,
    totalOrders,
    totalProducts,
    totalAmount,
  });
});
