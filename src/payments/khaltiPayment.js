import axios from "axios";
import { KHALTI_GATEWAY_URL, KHALTI_SECRET_KEY } from "../../secret.js";
import { orderService } from "../services/order.service.js";

// Function to initialize Khalti Payment
export async function initializeKhaltiPayment(details) {
  const config = {
    headers: {
      Authorization: `key ${KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };

  const bodyContent = JSON.stringify(details);

  try {
    // Pass the URL directly here instead of including it in reqOptions
    const response = await axios.post(
      `${KHALTI_GATEWAY_URL}/initiate/`,
      bodyContent,
      config
    );

    return response.data;
  } catch (error) {
    console.log("Error initializing Khalti payment:", error.response.data);
    throw error;
  }
}

// Function to verify Khalti Payment
export async function verifyKhaltiPayment(pidx, orderId, userId) {
  try {
    const headers = {
      Authorization: `key ${KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    };

    const checkOrder = await orderService.getSpecifcOrder(orderId);

    if (checkOrder.orderStatus === "shipped") {
      throw new Error("Order already shipped.");
    }

    const response = await axios.post(
      `${KHALTI_GATEWAY_URL}/lookup/`,
      { pidx },
      { headers }
    );

    if (response.data.status !== "Completed") {
      throw new Error("Payment verification failed.");
    }

    return response.data;
  } catch (error) {
    console.error("Error verifying Khalti payment:", error);
    throw error;
  }
}
