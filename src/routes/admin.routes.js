import { Router } from "express";
import { successHandler } from "../handlers/success/successHandler.js";
import { userSchema } from "../models/user.js";
import { orderSchema } from "../models/order.js";
import { productSchema } from "../models/products.js";

export const adminRoutes = Router();

adminRoutes.use("/dashboard", async (req, res, next) => {
  const totalUsers = await userSchema.countDocuments();
  const totalOrders = await orderSchema.countDocuments();
  const totalProducts = await productSchema.countDocuments();

  successHandler(res, 200, { totalUsers, totalOrders, totalProducts });
});
