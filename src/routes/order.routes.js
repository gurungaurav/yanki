import { Router } from "express";
import { orderController } from "../controller/order.controller.js";
import { ClientAuthRole } from "../middlewares/auth/roleAuth.middleware.js";

export const orderRoutes = Router();

orderRoutes.post("/placeOrder", ClientAuthRole(), orderController.createOrder);
orderRoutes.get(
  "/getSpecificUserOrders",
  ClientAuthRole(),
  orderController.getOrders
);
orderRoutes.delete(
  "/cancelOrder/:id",
  ClientAuthRole(),
  orderController.cancelOrder
);
orderRoutes.get("/getOrdersAdmin", orderController.getOrdersAdmin);

orderRoutes.put("/updateOrderStatus/:id", orderController.updateOrder);

orderRoutes.post(
  "/verifyPayment",
  ClientAuthRole(),
  orderController.completeKhaltiPayment
);
orderRoutes.get("/getSpecificOrder/:id", orderController.getSpecificOrder);
