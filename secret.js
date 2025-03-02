import { configDotenv } from "dotenv";

configDotenv({ path: ".env" });

//!URL's
export const PORT = process.env.PORT;
export const BASE_URL = process.env.BASE_URL;
export const DATABASE_URL = process.env.DATABASE_URL;
export const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;

//!JWT
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

//!KHALTI
export const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;
export const KHALTI_GATEWAY_URL = process.env.KHALTI_GATEWAY_URL;
