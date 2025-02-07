import CustomError from "./customError.js";

export const errorRoute404Handler = (req) => {
  throw new CustomError(`API Not Found - ${req.originalUrl}`, 404);
};
