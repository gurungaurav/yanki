const OrderDetailsSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "orders",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

export const orderDetailsSchema = mongoose.model(
  "OrderDetails",
  OrderDetailsSchema
);
