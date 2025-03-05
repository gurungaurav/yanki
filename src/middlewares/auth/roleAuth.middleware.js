import { verifyJwtTokenMiddleware } from "./jwt.middleware.js";

const adminAuth = async (req, res, next) => {
  try {
    if (req.user.role === "Admin") {
      next();
    } else {
      throw new Error("You have no authorization");
    }
  } catch (e) {
    next(e);
  }
};

const clientAuth = async (req, res, next) => {
  try {
    if (req.user.role === "user") {
      next();
    } else {
      throw new Error("You have no authorization");
    }
  } catch (e) {
    next(e);
  }
};

export const AdminAuthRole = () => {
  return [verifyJwtTokenMiddleware, adminAuth];
};

export const ClientAuthRole = () => {
  return [verifyJwtTokenMiddleware, clientAuth];
};
