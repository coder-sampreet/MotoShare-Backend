// src/core/APIError.js
import ERROR_CODES from "../constants/errorCodes.const.js";
import HTTP_STATUS from "../constants/httpStatusCodes.const.js";

class APIError extends Error {
    /**
     * Custom API error to standardize error responses.
     * @param {string} message - Human-readable error message.
     * @param {number} statusCode - HTTP status code (default is 500).
     * @param {string|null} errorCode - Custom internal error code for tracking.
     * @param {object|null} details - Optional error metadata or validation details.
     */
    constructor(
        message = "Internal Server Error",
        statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
        errorCode = ERROR_CODES.INTERNAL_ERROR,
        details = null
    ) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.details = details;

        Error.captureStackTrace?.(this, this.constructor);
    }

    /**
     * Format error response for Express middleware.
     */
    toResponse() {
        return {
            success: false,
            message: this.message,
            errorCode: this.errorCode,
            details: this.details,
        };
    }

    /**
     * Static helpers for specific error types.
     */
    static throwBadRequest(message = "Bad Request", details = null) {
        throw new APIError(
            message,
            HTTP_STATUS.BAD_REQUEST,
            ERROR_CODES.BAD_REQUEST,
            details
        );
    }

    static throwUnauthorized(message = "Unauthorized", details = null) {
        throw new APIError(
            message,
            HTTP_STATUS.UNAUTHORIZED,
            ERROR_CODES.UNAUTHORIZED,
            details
        );
    }

    static throwNotFound(message = "Not Found", details = null) {
        throw new APIError(
            message,
            HTTP_STATUS.NOT_FOUND,
            ERROR_CODES.NOT_FOUND,
            details
        );
    }

    static throwInternal(message = "Internal Server Error", details = null) {
        throw new APIError(
            message,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            ERROR_CODES.INTERNAL_ERROR,
            details
        );
    }

    static throwConflict(message = "Conflict", details = null) {
        throw new APIError(
            message,
            HTTP_STATUS.CONFLICT,
            ERROR_CODES.CONFLICT,
            details
        );
    }
}

export default APIError;
