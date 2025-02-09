import { configDotenv } from "dotenv";

configDotenv({ path: ".env" });

//!URL's
export const PORT = process.env.PORT;
export const BASE_URL = process.env.BASE_URL;
export const DATABASE_URL = process.env.DATABASE_URL;
export const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;

//!JWT
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

//!GMAIL SECRET
export const GMAIL_SECRET_USER = process.env.GMAIL_SECRET_USER;
export const GMAIL_SECRET_PASS = process.env.GMAIL_SECRET_PASS;
