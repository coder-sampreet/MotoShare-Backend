import * as UserServices from "../services/user.services.js";
import APIResponse from "../core/APIResponse.js";
import asyncHandler from "../utils/asyncHandler.util.js";

const getMe = asyncHandler(async (req, res) => {
    const userId = req?.user?._id;

    const { user } = await UserServices.getUserById({ userId });

    return APIResponse.ok(res, user, "User fetched successfully");
});

const updateProfile = asyncHandler(async (req, res) => {
    const userId = req?.user?._id;
    const updates = req.body;
    const avatarPath = req.file?.path ?? null;

    const { user } = await UserServices.updateUserProfile({
        userId,
        updates,
        avatarPath,
    });

    return APIResponse.ok(res, user, "Profile update initiated");
});

const changePassword = asyncHandler(async (req, res) => {
    const userId = req?.user?._id;
    const { oldPassword, newPassword } = req.body;

    const { message } = await UserServices.changeUserPassword({
        userId,
        oldPassword,
        newPassword,
    });

    return APIResponse.ok(res, null, message);
});

export { getMe, updateProfile, changePassword };
