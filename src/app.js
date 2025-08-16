// src/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import APIError from "./core/APIError.js";
import globalRateLimiter from "./middlewares/rateLimiter.middleware.js";
import env from "./config/env.config.js";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(cors({ origin: env.CORS_ORIGIN })); // improve this later
app.use(helmet({ crossOriginEmbedderPolicy: false }));

// Rate limiting (apply before main routes)
app.use(globalRateLimiter);

// Routes
app.use("/api/v1", routes);

// 404 Handler
app.use((req, res, next) => {
    next(APIError.throwNotFound("Resource Not found!"));
});

// Global error handler
app.use(errorHandler);

export default app;
