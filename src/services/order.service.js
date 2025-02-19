import { orderSchema } from "../models/order.js";
import { orderDetailsSchema } from "../models/orderDetails.js";
import { productSchema } from "../models/products.js";

class OrderService {
  async placeOrder(userId, orderItems) {
    if (!orderItems || orderItems.length === 0) {
      throw new Error("Order items cannot be empty.");
    }

    let totalAmount = 0;
    const order = await orderSchema.create({ userId });

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

  async getOrders(userId) {
    const orders = await orderSchema.find({ userId });

    if (!orders.length) {
      throw new Error("No orders found.");
    }

    // Fetch order details for each order
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const orderDetails = await orderDetailsSchema
          .find({ orderId: order._id })
          .lean();

        // Fetch product details for each order item
        const orderItems = await Promise.all(
          orderDetails.map(async (item) => {
            const product = await productSchema.findById(item.productId).lean();
            return {
              productId: item.productId,
              productName: product ? product.name : "Product Not Found",
              price: item.price,
              quantity: item.quantity,
            };
          })
        );

        return {
          orderId: order._id,
          orderDate: order.orderDate,
          orderStatus: order.orderStatus,
          items: orderItems,
        };
      })
    );

    return ordersWithDetails;
  }
}

export const orderService = new OrderService();
