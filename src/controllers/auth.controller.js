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
    path: "/",
};

const register = asyncHandler(async (req, res) => {
    const { fullName, username, email, phone, password } = req.body;
    const avatarPath = req.file?.path ?? null;
    const ip = req.ip;
    const userAgent = req.get("user-agent");

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
    const userAgent = req.get("user-agent");

    const { user, accessToken, refreshToken } = await AuthServices.loginUser({
        emailOrUsername,
        password,
        ip,
        userAgent,
    });

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

const logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    await AuthServices.logoutUser({ refreshToken });

    res.clearCookie("accessToken", accessTokenCookieOptions);
    res.clearCookie("refreshToken", refreshTokenCookieOptions);

    return APIResponse.ok(res, null, "Logged out successfully");
});

const refreshAccessTokenController = asyncHandler(async (req, res) => {
    const oldRefreshToken = req.cookies?.refreshToken;
    const ip = req.ip;
    const userAgent = req.get("user-agent");

    const { accessToken, refreshToken } = await AuthServices.refreshAccessToken(
        {
            refreshToken: oldRefreshToken,
            ip,
            userAgent,
        }
    );
    
    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    return APIResponse.ok(
        res,
        {
            accessToken: accessToken,
            refreshToken: refreshToken,
        },
        "Access token refreshed successfully"
    );
});

export { register, login, logout, refreshAccessTokenController };
