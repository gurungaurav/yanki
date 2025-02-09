import { successHandler } from "../handlers/success/successHandler.js";
import { orderService } from "../services/order.service.js";

class OrderController {
  async createOrder(req, res, next) {
    try {
      const userId = req.user._id;
      console.log(req.user, "jajsjasrfejb");

      const orderItems = req.body.orderItems;
      const order = await orderService.placeOrder(userId, orderItems);

      return successHandler(res, 201, order, "Order placed successfully.");
    } catch (e) {
      next(e);
    }
  }
}

export const orderController = new OrderController();
