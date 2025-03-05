import { BASE_URL } from "../../secret.js";
import { successHandler } from "../handlers/success/successHandler.js";
import { paymentSchema } from "../models/payment.js";
import {
  initializeKhaltiPayment,
  verifyKhaltiPayment,
} from "../payments/khaltiPayment.js";
import { orderService } from "../services/order.service.js";
import { userService } from "../services/user.service.js";

class OrderController {
  async createOrder(req, res, next) {
    try {
      const userId = req.user._id;

      const {
        website_url,
        orderItems,
        totalPrice,
        purchase_order_id,
        paymentMethod,
        userDetails,
      } = req.body;

      let existingOrder;

      if (purchase_order_id) {
        existingOrder = await orderService.getSpecifcOrder(purchase_order_id);
      }

      // if order already exists, return the existing order if not create a new order
      //This is for the case if the payment is not completed and user tries to place the order again
      let order;
      if (existingOrder) {
        order = existingOrder;
      } else {
        order = await orderService.placeOrder(
          userId,
          orderItems,
          paymentMethod
        );
        await userService.updateUser(userId, userDetails);

        if (paymentMethod === "cod") {
          await paymentSchema.create({
            orderId: order.orderId,
            paymentMethod: "Cash on Delivery",
            amount: order.totalAmount,
          });

          return successHandler(
            res,
            201,
            { orderId: order.orderId },
            "Order placed successfully."
          );
        }
      }

      const paymentInitate = await initializeKhaltiPayment({
        amount: totalPrice * 100, // amount should be in paisa (Rs * 100)
        purchase_order_id: order.orderId, // purchase_order_id because we need to verify it later
        purchase_order_name: "barber items",
        return_url: `http://localhost:5000/product/order-details`, // it can be even managed from frontedn
        website_url,
      });

      return successHandler(
        res,
        201,
        paymentInitate,
        "Order placed successfully."
      );
    } catch (e) {
      next(e);
    }
  }

  async getOrders(req, res, next) {
    try {
      const userId = req.user._id;
      const { status } = req.query;
      const filters = {};

      if (status) {
        filters.orderStatus = status;
      }

      const orders = await orderService.getOrders(userId, filters);

      return successHandler(res, 200, orders, "Orders retrieved successfully.");
    } catch (e) {
      next(e);
    }
  }

  async getSpecificOrder(req, res, next) {
    try {
      const orderId = req.params.id;
      const order = await orderService.getSpecifcOrder(orderId);

      return successHandler(res, 200, order, "Order retrieved successfully.");
    } catch (e) {
      next(e);
    }
  }

  async updateOrder(req, res, next) {
    try {
      const orderId = req.params.id;
      const { status } = req.body;
      await orderService.updateOrder(orderId, status);

      return successHandler(res, 200, null, "Order updated successfully.");
    } catch (e) {
      next(e);
    }
  }

  async completeKhaltiPayment(req, res, next) {
    try {
      const { pidx, orderId } = req.body;
      const userId = req.user._id;

      const paymentDetails = await verifyKhaltiPayment(pidx, orderId, userId);

      await orderService.completeKhaltiPayment(
        orderId,
        paymentDetails.total_amount
      );

      return successHandler(res, 201, null, "Order placed successfully.");
    } catch (e) {
      next(e);
    }
  }

  async verifyKhaltiPayment(req, res, next) {
    try {
      const { pidx } = req.body;
      const order = await orderService.verifyKhaltiPayment(pidx);

      return successHandler(
        res,
        200,
        order,
        "Khalti payment verified successfully."
      );
    } catch (e) {
      next(e);
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const userId = req.user._id;
      const orderId = req.params.id;
      await orderService.cancelOrder(userId, orderId);

      return successHandler(res, 200, null, "Order cancelled successfully.");
    } catch (e) {
      next(e);
    }
  }

  async getOrdersAdmin(req, res, next) {
    try {
      const { status } = req.query;
      const filters = {};

      if (status) {
        filters.orderStatus = status;
      }

      const orders = await orderService.getOrders(undefined, filters);

      return successHandler(res, 200, orders, "Orders retrieved successfully.");
    } catch (e) {
      next(e);
    }
  }
}

export const orderController = new OrderController();
