export const errorHandler = (error, res) => {
  const errorMessage = error?.message || "Something went wrong";
  const status = error.status ? error.status : 500;

  return res.status(status).json({
    success: false,
    message: errorMessage,
  });
};
