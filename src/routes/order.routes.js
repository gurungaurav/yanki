import { Router } from "express";
import { orderController } from "../controller/order.controller.js";
import { ClientAuthRole } from "../middlewares/auth/roleAuth.middleware.js";

export const orderRoutes = Router();

orderRoutes.post("/placeOrder", ClientAuthRole(), orderController.createOrder);
orderRoutes.get("/getUsersOrders", ClientAuthRole(), orderController.getOrders);
