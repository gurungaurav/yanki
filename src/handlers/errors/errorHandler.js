export const errorHandler = (error, req, res, next) => {
  const errorMessage = error?.message || "Something went wrong";
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: errorMessage,
  });
};
