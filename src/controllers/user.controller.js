import * as UserServices from "../services/user.services.js";
import APIResponse from "../core/APIResponse.js";
import asyncHandler from "../utils/asyncHandler.util.js";

const getMe = asyncHandler(async (req, res) => {
    const userId = req?.user?._id;

    const { user } = await UserServices.getUserById({ userId });

    return APIResponse.ok(res, user, "User fetched successfully");
});

export { getMe };
