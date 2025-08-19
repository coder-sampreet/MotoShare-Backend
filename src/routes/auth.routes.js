import express from "express";
import * as AuthController from "../controllers/auth.controller.js";
import { uploadAvatar } from "../middlewares/multer.middleware.js";
import validate from "../middlewares/requestValidator.middleware.js";
import {
    loginUserSchema,
    registerUserSchema,
} from "../validations/auth.validation.js";
import multerErrorHandler from "../middlewares/multerErrorHandler.middleware.js";
import autoCleanupOnError from "../middlewares/cleanup.middleware.js";
import { authRateLimiter } from "../middlewares/rateLimiter.middleware.js";
const router = express.Router();

router.post(
    "/register",
    multerErrorHandler(uploadAvatar),
    validate(registerUserSchema),
    authRateLimiter,
    AuthController.register,
    autoCleanupOnError
);

router.post(
    "/login",
    validate(loginUserSchema),
    authRateLimiter,
    AuthController.login
);

router.post("/logout", AuthController.logout);

router.post("/refresh-token", AuthController.refreshAccessTokenController);

export default router;
