import * as UserController from "../controllers/user.controller.js";
import requireAuth from "../middlewares/auth.middleware.js";
import {
    updateUserSchema,
    changePasswordSchema,
} from "../validations/user.validation.js";
import validate from "../middlewares/requestValidator.middleware.js";
import multerErrorHandler from "../middlewares/multerErrorHandler.middleware.js";
import { uploadAvatar } from "../middlewares/multer.middleware.js";
import cleanupUploadedFiles from "../middlewares/cleanup.middleware.js";

import express from "express";

const router = express.Router();

router.use(requireAuth);

router
    .route("/me")
    .get(UserController.getMe)
    .patch(
        multerErrorHandler(uploadAvatar),
        validate(updateUserSchema),
        UserController.updateProfile,
        cleanupUploadedFiles
    );

router.patch(
    "/change-password",
    validate(changePasswordSchema),
    UserController.changePassword
);

export default router;
