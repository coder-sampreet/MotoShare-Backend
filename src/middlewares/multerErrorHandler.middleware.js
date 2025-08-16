import multer from "multer";
import APIError from "../core/APIError.js";
import ERROR_CODES from "../constants/errorCodes.const.js";
import HTTP_STATUS from "../constants/httpStatusCodes.const.js";

const multerErrorHandler = (uploadMiddleware) => {
    return (req, res, next) => {
        uploadMiddleware(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // Multer-specific errors (LIMIT_FILE_SIZE, LIMIT_UNEXPECTED_FILE, etc.)
                return next(
                    new APIError(
                        "File upload failed",
                        HTTP_STATUS.BAD_REQUEST,
                        ERROR_CODES.BAD_REQUEST,
                        {
                            field: err.field,
                            type: err.code, // e.g., "LIMIT_FILE_SIZE"
                            message: err.message,
                        }
                    )
                );
            } else if (err) {
                // Custom fileFilter errors or unexpected
                return next(
                    new APIError(
                        err.message || "Invalid file upload",
                        HTTP_STATUS.BAD_REQUEST,
                        ERROR_CODES.BAD_REQUEST
                    )
                );
            }
            next();
        });
    };
};

export default multerErrorHandler;
