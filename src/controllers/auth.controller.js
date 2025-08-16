import * as AuthServices from "../services/auth.services.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import APIResponse from "../core/APIResponse.js";
import logger from "../config/logger.config.js";

const accessTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
    path: "/",
};

const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/v1/auth/refresh-token",
};

const register = asyncHandler(async (req, res) => {
    const { fullName, username, email, phone, password } = req.body;
    const avatarPath = req.file?.path ?? null;
    const ip = req.ip;
    const userAgent = req.get("User-Agent");

    const { user, accessToken, refreshToken } = await AuthServices.registerUser(
        {
            fullName,
            username,
            email,
            phone,
            password,
            avatarPath,
            ip,
            userAgent,
        }
    );

    logger.info(`New user registered: ${user.email} from IP ${ip}`);

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    return APIResponse.created(
        res,
        {
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken,
        },
        "User registered successfully"
    );
});

const login = asyncHandler(async (req, res) => {
    const { emailOrUsername, password } = req.body;
    const ip = req.ip;
    const userAgent = req.get("User-Agent");

    const { user, accessToken, refreshToken } = await AuthServices.loginUser({
        emailOrUsername,
        password,
        ip,
        userAgent,
    });

    logger.info(`User Login: ${user.email} from IP ${ip}`);

    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    return APIResponse.ok(
        res,
        {
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken,
        },
        "Login Successful"
    );
});
export { register, login };
