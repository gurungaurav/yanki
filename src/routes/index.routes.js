import { Router } from "express";
import { userRoutes } from "./user.routes.js";
import { authRoutes } from "./auth.routes.js";
import { productRoutes } from "./product.routes.js";
import { adminRoutes } from "./admin.routes.js";
import {
  AdminAuthRole,
  ClientAuthRole,
} from "../middlewares/auth/roleAuth.middleware.js";
import { orderRoutes } from "./order.routes.js";
import { reviewRoutes } from "./reivew.routes.js";
import { categoryRoutes } from "./category.routes.js";

const indexRoutes = Router();

indexRoutes.use("/user", ClientAuthRole(), userRoutes);
indexRoutes.use("/auth", authRoutes);
indexRoutes.use("/product", productRoutes);
indexRoutes.use("/order", orderRoutes);
indexRoutes.use("/review", reviewRoutes);
indexRoutes.use("/admin", AdminAuthRole(), adminRoutes);
indexRoutes.use("/category", categoryRoutes);
export default indexRoutes;
