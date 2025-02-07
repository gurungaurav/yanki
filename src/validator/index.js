import { ValidationError } from "yup";

//Dynamic validator
export const validateSchema = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: error.inner.map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    } else {
      next(error);
    }
  }
};
