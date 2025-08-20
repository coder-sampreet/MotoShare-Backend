import * as UserController from "../controllers/user.controller.js";
import requireAuth from "../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();

router.use(requireAuth);

router.route("/me").get(UserController.getMe);

export default router;
