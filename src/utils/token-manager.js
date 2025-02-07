import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../../secret.js";

//!For Refresh token
// Function to create a JWT
export const JWTCreation = ({ userId, role }) => {
  const token = jwt.sign({ userId, role }, JWT_SECRET_KEY, {
    expiresIn: "10d",
    algorithm: "HS256",
  });
  return token;
};

// Function to verify a JWT token
export const JWTVerification = (token) => {
  return jwt.verify(token, JWT_SECRET_KEY);
};
