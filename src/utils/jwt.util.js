import jwt from "jsonwebtoken";
import env from "../config/env.config.js";

const {
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY,
} = env;

const generateAccessToken = ({ id, username, email }) => {
    const payload = {
        id: id,
        username: username,
        email: email,
    };
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    });
};

const generateRefreshToken = ({ id, username, email }) => {
    const payload = {
        id: id,
        username: username,
        email: email,
    };
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
    });
};

const verifyAccessToken = (accessToken) => {
    try {
        return jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    } catch (err) {
        throw err;
    }
};

const verifyRefreshToken = (refreshToken) => {
    try {
        return jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (err) {
        throw err;
    }
};

export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};
