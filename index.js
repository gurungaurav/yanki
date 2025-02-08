import express from "express";
import { FRONTEND_BASE_URL, PORT } from "./secret.js";
import indexRoutes from "./src/routes/index.routes.js";
import { errorHandler } from "./src/handlers/errors/errorHandler.js";
import { errorRoute404Handler } from "./src/handlers/errors/errorRoute404Handler.js";
import cors from "cors";
import { db } from "./src/config/dbConfig.js";

//!For Database Connection
db();

const app = express();
const port = PORT || 8000;

app.use(
  cors({
    origin: FRONTEND_BASE_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
//For image
app.use("/uploads", express.static("uploads"));

app.use(express.json());

app.use("/api", indexRoutes);

//Error Handlers
app.use(errorRoute404Handler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
