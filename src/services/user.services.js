import { User } from "../models/user.model.js";

import APIError from "../core/APIError.js";
import { deleteImage, uploadAvatar } from "../utils/cloudinary.util.js";
import logger from "../config/logger.config.js";

const getUserById = async ({ userId }) => {
    if (!userId) APIError.throwBadRequest("User ID is required");

    const user = await User.findById(userId).select("-password");
    if (!user) APIError.throwNotFound("User not found");

    return {
        user: user.toJSON(),
    };
};

const updateUserProfile = async ({ userId, updates, avatarPath }) => {
    if (!userId) APIError.throwBadRequest("User ID is required");

    const user = await User.findById(userId);
    if (!user) APIError.throwNotFound("User not found");

    const existingUser = await User.findOne({
        _id: { $ne: userId }, // exclude self
        $or: [
            { email: updates?.email },
            { username: updates?.username },
            { phone: updates?.phone },
        ],
    });

    if (existingUser) {
        
        if (existingUser.email === updates.email) {
            
            APIError.throwConflict("Email already in use");
        } else if (existingUser.username === updates.username) {
            console.log("here");
            APIError.throwConflict("Username already in use");
        } else {
            APIError.throwConflict("Phone number already in use");
        }
    }

    if (updates.username) user.username = updates.username;
    if (updates.email) user.email = updates.email;
    if (updates.phone) user.phone = updates.phone;

    await user.save();

    if (avatarPath) {
        (async () => {
            try {
                if (user.avatarPublicId) await deleteImage(user.avatarPublicId);

                const { url, publicId } = await uploadAvatar(avatarPath);

                user.avatar = url;
                user.avatarPublicId = publicId;
                await user.save();

                logger.info(
                    `Avatar updated in the background for user ${user._id}`
                );
            } catch (err) {
                logger.error(
                    `Background avatar update failed for user ${user._id} `,
                    err
                );
            }
        })();
    }

    return {
        user: user.toJSON(),
    };
};

const changeUserPassword = async ({ userId, oldPassword, newPassword }) => {
    if (!userId) APIError.throwBadRequest("User ID is required");

    const user = await User.findById(userId).select("+password");
    if (!user) APIError.throwNotFound("User not found");

    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) APIError.throwUnauthorized("Old password is incorrect");

    user.password = newPassword;
    await user.save();

    logger.info(`Password changed for user ${user.email}`);
    return {
        success: true,
        message: "Password updated successfully",
    };
};

export { getUserById, updateUserProfile, changeUserPassword };
