import { User } from "../models/user.model.js";

import APIError from "../core/APIError.js";

const getUserById = async ({ userId }) => {
    if (!userId) APIError.throwBadRequest("User ID is required");

    const user = await User.findById(userId).select("-password");
    if (!user) APIError.throwNotFound("User not found");

    return {
        user: user.toJSON(),
    };
};

export { getUserById };
