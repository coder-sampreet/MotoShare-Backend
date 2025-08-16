import APIError from "../core/APIError.js";
import ERROR_CODES from "../constants/errorCodes.const.js";
import HTTP_STATUS from "../constants/httpStatusCodes.const.js";

const validate =
    (zodSchema, source = "body") =>
    (req, res, next) => {
        const result = zodSchema.safeParse(req[source]);

        if (!result.success) {
            const zodError = result.error.issues.map((e) => ({
                field: e.path[0],
                message: e.message,
            }));
            return next(
                new APIError(
                    "Validation Failed",
                    HTTP_STATUS.BAD_REQUEST,
                    ERROR_CODES.BAD_REQUEST,
                    zodError
                )
            );
        }
        req[source] = result.data;
        next();
    };

export default validate;
