// src/core/APIResponse.js
import HTTP_STATUS from "../constants/httpStatusCodes.const.js";

class APIResponse {
    /**
     * Create a structured API success response.
     * @param {string} message - Descriptive success message.
     * @param {object|array|null} data - The actual payload/data to return.
     * @param {number} statusCode - HTTP status code (default is 200).
     */
    constructor(message = "Success", data = null, statusCode = HTTP_STATUS.OK) {
        this.success = true;
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
    }

    /**
     * Send the API response using Express `res`.
     */
    send(res) {
        return res.status(this.statusCode).json({
            success: this.success,
            message: this.message,
            data: this.data,
        });
    }

    /**
     * Static helper to directly send a response without instantiating.
     */
    static send(
        res,
        { message = "Success", data = null, statusCode = HTTP_STATUS.OK }
    ) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }

    static ok(res, data = null, message = "OK") {
        return this.send(res, {
            statusCode: HTTP_STATUS.OK,
            message,
            data,
        });
    }

    static created(res, data = null, message = "Resource created") {
        return this.send(res, {
            statusCode: HTTP_STATUS.CREATED,
            message,
            data,
        });
    }
}

export default APIResponse;
