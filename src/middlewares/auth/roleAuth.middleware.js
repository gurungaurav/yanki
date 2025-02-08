import { verifyAccessJwtTokenMiddleware } from "./jwt.middleware.js";

const adminAuth = async (req, res, next) => {
  try {
    // console.log(req.user);

    if (req.user.role === "Admin") {
      // console.log("pass");

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
    if (req.user.role === "User") {
      if (req.user.userId !== req.params.userId) {
        console.log(req.user, req.params, "jajsjas");

        throw new Error("You have no authorization non-user", 401);
      }
      next();
    } else {
      throw new Error("You have no authorization");
    }
  } catch (e) {
    next(e);
  }
};

export const AdminAuthRole = () => {
  return [verifyAccessJwtTokenMiddleware, adminAuth];
};

export const ClientAuthRole = () => {
  return [verifyAccessJwtTokenMiddleware, clientAuth];
};
