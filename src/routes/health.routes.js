import express from "express";
import { healthController } from "../controllers/health.controller.js";
import { authMiddleware } from "../middlewares/token.middleware.js";
import { isProduction } from "../utils/environment.js";

const router = express.Router();

//TODO: Add Swagger comments
router.get(
	"/",
	authMiddleware({ requireAuth: isProduction ? true : false }),
	healthController
);

export default router;
