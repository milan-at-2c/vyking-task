import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import { successHandler, errorHandler } from "./config/morgan";
import { documentationSpecs } from "./docs/specifications";
import {
  errorConverter,
  errorHandler as apiErrorHandler,
} from "./middlewares/error";
import { apiRouter } from "./routes/api";
import { healthcheckRouter } from "./routes/healthcheck/healthcheck.route";

export const app = express();

app.use(successHandler);
app.use(errorHandler);

app.use(express.json({ limit: "1mb" }));

app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.enable("trust proxy");

// Secure HTTP headers
app.use(helmet());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(documentationSpecs));
app.use("/api", apiRouter);
app.use("/", healthcheckRouter);

// Convert Error to ApiError if needed
app.use(errorConverter);

// Handle Errors
app.use(apiErrorHandler);
