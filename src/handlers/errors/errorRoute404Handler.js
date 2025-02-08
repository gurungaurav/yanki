export const errorRoute404Handler = (req) => {
  throw new Error(`API Not Found - ${req.originalUrl}`, 404);
};
