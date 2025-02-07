import { Router } from "express";
import { userRoutes } from "./client/user.routes.js";
import { authRoutes } from "./auth/auth.routes.js";
import { adminRoutes } from "./admin/admin.routes.js";
import { AdminAuthRole } from "../middlewares/auth/roleAuth.middleware.js";

const indexRoutes = Router();

indexRoutes.use("/user", userRoutes);
indexRoutes.use("/auth", authRoutes);
indexRoutes.use("/admin", AdminAuthRole(), adminRoutes);
export default indexRoutes;
