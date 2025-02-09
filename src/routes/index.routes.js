import { Router } from "express";
import { userRoutes } from "./user.routes.js";
import { authRoutes } from "./auth.routes.js";
import { productRoutes } from "./product.routes.js";
import { adminRoutes } from "./admin.routes.js";
import { AdminAuthRole } from "../middlewares/auth/roleAuth.middleware.js";
import { orderRoutes } from "./order.routes.js";

const indexRoutes = Router();

indexRoutes.use("/user", userRoutes);
indexRoutes.use("/auth", authRoutes);
indexRoutes.use("/product", productRoutes);
indexRoutes.use("/order", orderRoutes);
indexRoutes.use("/admin", AdminAuthRole(), adminRoutes);
export default indexRoutes;
