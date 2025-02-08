import { Router } from "express";
import { successHandler } from "../handlers/success/successHandler.js";

export const adminRoutes = Router();

adminRoutes.use("/dashboard", (req, res, next) => {
  successHandler(res, 201, null, "Authorized");
});
