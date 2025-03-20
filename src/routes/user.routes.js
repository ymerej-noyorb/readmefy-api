import express from "express";
import { userController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/token.middleware.js";

const router = express.Router();

router.get("/me", authMiddleware({ requireAuth: true }), userController);

export default router;
