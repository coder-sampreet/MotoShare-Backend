// src/routes/index.js
import express from "express";
import AuthRoutes from "./auth.routes.js";
import UserRoutes from "./user.routes.js";

const router = express.Router();

router.use("/auth", AuthRoutes);
router.use("/user", UserRoutes);

export default router;
