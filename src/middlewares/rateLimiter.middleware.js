// src/middlewares/rateLimiter.middleware.js
import rateLimit from "express-rate-limit";
import HTTP_STATUS from "../constants/httpStatusCodes.const.js";
import env from "../config/env.config.js"

const isDev = env.NODE_ENV === "development";

/**
 * Global rate limiter to prevent abuse.
 * Adjust windowMs and max according to your needs.
 */
const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isDev ? 500 : 100, // Higher for dev, lower for prod
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    message: {
        success: false,
        message: "Too many requests from this IP, please try again later.",
    },
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS || 429, // fallback for older const list
});

const authRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: isDev ? 50 : 5, // very strict in production
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many login attempts, please try again later.",
    },
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS || 429,
});

export default globalRateLimiter;
export { authRateLimiter };
