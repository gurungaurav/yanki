import * as yup from "yup";

export const userRegisterSchema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  username: yup.string().required(),
  email: yup.string().email().required(),
  phoneNumber: yup.string().required().min(10).max(10),
  address: yup.string().required(),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export const userLoginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});
