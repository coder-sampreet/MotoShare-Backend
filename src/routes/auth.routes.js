import express from "express";
import * as AuthController from "../controllers/auth.controller.js";
import { uploadAvatar } from "../middlewares/multer.middleware.js";
import validate from "../middlewares/requestValidator.middleware.js";
import { registerUserSchema } from "../validations/auth.validation.js";
import multerErrorHandler from "../middlewares/multerErrorHandler.middleware.js";
import autoCleanupOnError from "../middlewares/cleanup.middleware.js";

const router = express.Router();

router.post(
    "/register",
    multerErrorHandler(uploadAvatar),
    validate(registerUserSchema),
    AuthController.register,
    autoCleanupOnError
);

export default router;
