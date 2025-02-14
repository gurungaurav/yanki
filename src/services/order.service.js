import mongoose from "mongoose";
import { orderSchema } from "../models/order.js";
import { orderDetailsSchema } from "../models/orderDetails.js";
import { productSchema } from "../models/products.js";

class OrderService {
  async placeOrder(userId, orderItems) {
    if (!orderItems || orderItems.length === 0) {
      throw new Error("Order items cannot be empty.");
    }

    // Create new order
    const order = await orderSchema.create({ userId });

    // Prepare order details
    const orderDetails = orderItems.map((item) => ({
      orderId: order._id,
      productId: item.productId,
      price: item.price,
      quantity: item.quantity,
    }));

    // Insert order details
    await orderDetailsSchema.insertMany(orderDetails);

    // Update stock for each product
    for (const item of orderItems) {
      //check the product quantity
      const productId = new mongoose.Types.ObjectId(item.productId);

      const product = await productSchema.findById(productId);
      console.log(product, "jjajaaj");

      if (!product) {
        throw new Error("Required product did not found : " + item.productId);
      }

      if (product.stockQuantity > 0) {
        throw new Error("Insufficient stock for product: " + product.name);
      }

      await productSchema.updateOne(
        { _id: item.productId },
        { $inc: { stockQuantity: -item.quantity } } // Reduce stock
      );
    }

    return order;
  }

  async getOrders(userId) {
    const orders = await orderSchema.find({ userId }).select();
    if (!orders.length) {
      throw new Error("No orders found");
    }
    return orders;
  }
}

export const orderService = new OrderService();
