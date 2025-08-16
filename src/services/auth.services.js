import { User } from "../models/user.model.js";
import { Token } from "../models/token.model.js";

import {
    generateAccessToken,
    generateRefrehToken,
    verifyRefreshToken,
} from "../utils/jwt.util.js";

import { uploadAvatar } from "../utils/cloudinary.util.js";

import APIError from "../core/APIError.js";

const registerUser = async ({
    fullName,
    username,
    email,
    phone,
    password,
    avatarPath,
    ip,
    userAgent,
}) => {
    const existingUser = await User.findOne({
        $or: [{ email }, { username }, { phone }],
    });

    if (existingUser) {
        if (existingUser.email === email) {
            APIError.throwConflict("Email already in use");
        } else if (existingUser.username === username) {
            APIError.throwConflict("Username already in use");
        } else {
            APIError.throwConflict("Phone number already in use");
        }
    }

    let avatar = null;
    let avatarPublicId = null;
    if (avatarPath) {
        try {
            const { url, publicId } = await uploadAvatar(avatarPath);
            avatar = url;
            avatarPublicId = publicId;
        } catch (err) {
            console.error(
                "Failed to upload avatar on cloudinary! Error: ",
                err
            );
            avatar = null;
            avatarPublicId = null;
        }
    }

    const user = await User.create({
        fullName,
        username,
        email,
        phone,
        password,
        avatar,
        avatarPublicId,
    });

    if (!user) APIError.throwInternal("User creation failed!");

    const payload = {
        id: user._id,
        email: user.email,
        username: user.username,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefrehToken(payload);

    await Token.create({
        user: user._id,
        refreshToken,
        ip,
        userAgent,
        isValid: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
        user: user.toJSON(),
        accessToken,
        refreshToken,
    };
};

export { registerUser };
