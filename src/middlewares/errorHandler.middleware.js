// src/core/errorHandler.middleware.js
import APIError from "../core/APIError.js";
import ERROR_CODES from "../constants/errorCodes.const.js";
import env from "../config/env.config.js";

/**
 * Global error handler middleware for Express.
 * This should be the last middleware registered in the app.
 */
const errorHandler = (err, req, res, next) => {
    // If the error is an instance of our custom APIError, format it
    if (err instanceof APIError) {
        return res.status(err.statusCode).json(err.toResponse());
    }

    // Handle other unexpected errors
    console.debug("Unhandled Error:", err);

    // Try to extract a statusCode if available
    const statusCode = Number.isInteger(err.statusCode) ? err.statusCode : 500;

    // Optional details only in development
    const details =
        env.NODE_ENV === "development"
            ? { stack: err.stack, originalError: err }
            : undefined;

    const fallbackError = new APIError(
        err.message || "Internal Server Error",
        statusCode,
        ERROR_CODES.UNEXPECTED_ERROR,
        details
    );

    return res
        .status(fallbackError.statusCode)
        .json(fallbackError.toResponse());
};

export default errorHandler;
