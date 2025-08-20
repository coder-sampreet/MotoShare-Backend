import APIError from "../core/APIError.js";
import HTTP_STATUS from "../constants/httpStatusCodes.const.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import { verifyAccessToken } from "../utils/jwt.util.js";
import ERROR_CODES from "../constants/errorCodes.const.js";

const requireAuth = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) APIError.throwUnauthorized("Access token missing");

    try {
        const decoded = verifyAccessToken(token);

        if (!decoded?.id) APIError.throwUnauthorized("Malformed access token");

        const user = await User.findById(decoded.id).select("-password");

        if (!user)
            APIError.throwUnauthorized("User not found or invalid token");

        req.user = user.toJSON();
        return next();
    } catch (err) {
        if (err.name === "TokenExpiredError")
            APIError.throwUnauthorized("Access token has expired");
        if (err.name === "JsonWebTokenError")
            APIError.throwUnauthorized("Invalid access token");

        throw new APIError(
            "Authentication failed",
            HTTP_STATUS.UNAUTHORIZED,
            ERROR_CODES.UNAUTHORIZED,
            err
        );
    }
});

export default requireAuth;
