import mongoose from "mongoose";
import { orderSchema } from "../models/order.js";
import { orderDetailsSchema } from "../models/orderDetails.js";
import { paymentSchema } from "../models/payment.js";
import { productSchema } from "../models/products.js";
import { productService } from "./product.service.js";
import { imageSchema } from "../models/image.js";
import { userService } from "./user.service.js";

class OrderService {
  async placeOrder(userId, orderItems, paymentMethod) {
    if (!orderItems || orderItems.length === 0) {
      throw new Error("Order items cannot be empty.");
    }

    let totalAmount = 0;
    const order = await orderSchema.create({
      userId,
      orderStatus: paymentMethod === "cod" ? "shipped" : "pending",
    });

    const orderDetails = [];
    const unavailableItems = [];

    for (const item of orderItems) {
      const product = await productSchema.findById(item.productId);

      if (!product) {
        unavailableItems.push({
          productId: item.productId,
          reason: "Product not found",
        });
        continue; // Skip to the next item
      }

      if (product.stockQuantity < item.quantity) {
        unavailableItems.push({
          productId: item.productId,
          productName: product.name,
          availableStock: product.stockQuantity,
          requestedQuantity: item.quantity,
          reason: "Insufficient stock",
        });
        continue; // Skip to the next item
      }

      // Reduce stock without session
      await productSchema.updateOne(
        { _id: item.productId },
        { $inc: { stockQuantity: -item.quantity } }
      );

      orderDetails.push({
        orderId: order._id,
        productId: item.productId,
        price: product.price,
        quantity: item.quantity,
      });

      totalAmount += product.price * item.quantity;
    }

    if (orderDetails.length === 0) {
      throw new Error("No items available for order.");
    }

    // Insert order details
    await orderDetailsSchema.insertMany(orderDetails);

    return {
      orderId: order._id,
      totalAmount,
      items: orderDetails,
      unavailableItems,
      message: unavailableItems.length
        ? "Order placed partially. Some items were unavailable."
        : "Order placed successfully.",
    };
  }

  async getOrders(userId, filters) {
    //if user is available then fetch if not then get all orders
    const orders = userId
      ? await orderSchema.find({ userId, ...filters }).lean()
      : await orderSchema.find({ ...filters }).lean();

    const orderDetails = await Promise.all(
      orders.map(async (order) => {
        const payment = await paymentSchema
          .findOne({ orderId: order._id })
          .lean();
        const user = await userService.getUserById(order.userId);

        const orderDetails = await orderDetailsSchema.find({
          orderId: order._id,
        });

        //calculate total amount
        const totalAmount = orderDetails.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );

        return {
          orderId: order._id,
          orderDate: order.orderDate,
          orderStatus: order.orderStatus,
          totalAmount,
          paymentMethod: payment ? payment.paymentMethod : "Payment in process",
          ordersCount: orderDetails.length,
          username: user.username,
        };
      })
    );

    return orderDetails;
  }

  async getSpecifcOrder(orderId) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error("Invalid order ID.");
    }
    console.log(orderId, "orderId");

    const order = await orderSchema.findOne({ _id: orderId }).lean();
    console.log(order, "order");

    if (!order) {
      throw new Error("Order not found.");
    }
    const user = await userService.getUserById(order.userId);

    const orderDetails = await orderDetailsSchema.find({ orderId }).lean();

    const orderItems = await Promise.all(
      orderDetails.map(async (item) => {
        const product = await productSchema
          .findOne({ _id: item.productId })
          .populate("categoryId", "name")
          .lean();

        if (!product) {
          throw new Error("Product not found");
        }

        const images = await imageSchema
          .find({ productId: item.productId })
          .select("imageUrl");

        return {
          productId: item.productId,
          productName: product ? product.name : "Product Not Found",
          price: item.price,
          categoryName: product.categoryId.name,
          quantity: item.quantity,
          image: images[0].imageUrl,
        };
      })
    );

    const payment = await paymentSchema.findOne({ orderId }).lean();

    return {
      paymentMethod: payment ? payment.paymentMethod : "Payment in process",
      totalAmount: payment?.amount,
      orderId: order._id,
      orderDate: order.orderDate,
      orderStatus: order.orderStatus,
      items: orderItems,
      username: user.username,
      address: user.address,
    };
  }

  async updateOrder(orderId, status) {
    const order = await orderSchema.findOne({ _id: orderId });

    if (!order) {
      throw new Error("Order not found.");
    }

    return await orderSchema.updateOne(
      { _id: orderId },
      { orderStatus: status }
    );
  }

  async deleteOrder(userId, orderId) {
    const order = await orderSchema.findOne({ _id: orderId, userId });

    if (!order) {
      throw new Error("Order not found.");
    }

    return await orderSchema.deleteOne({ _id: orderId });
  }

  async completeKhaltiPayment(orderId, totalAmount) {
    await orderSchema.updateOne({ _id: orderId }, { orderStatus: "shipped" });

    return await paymentSchema.create({
      orderId,
      paymentMethod: "Khalti",
      amount: totalAmount / 100,
    });
  }

  async cancelOrder(userId, orderId) {
    const order = await orderSchema.findOne({ _id: orderId, userId });

    if (!order) {
      throw new Error("Order not found.");
    }

    await orderSchema.updateOne({ _id: orderId }, { orderStatus: "cancelled" });

    return { message: "Order cancelled successfully." };
  }
}

export const orderService = new OrderService();
