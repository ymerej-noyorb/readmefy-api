import express from "express";
import { authMiddleware } from "../middlewares/token.middleware.js";
import {
	loginController,
	logoutController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/login", authMiddleware(), loginController);

router.get("/logout", authMiddleware({ requireAuth: true }), logoutController);

export default router;
