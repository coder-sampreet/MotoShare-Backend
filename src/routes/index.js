// src/routes/index.js
import express from "express";
import AuthRoutes from "./auth.routes.js";
const router = express.Router();

router.use("/auth", AuthRoutes);

export default router;
