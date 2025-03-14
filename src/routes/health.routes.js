import express from "express";
import { healthController } from "../controllers/health.controller.js";
import { authMiddleware } from "../middlewares/token.middleware.js";
import { isProduction } from "../utils/environment.js";

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check server status
 *     description: Returns a message indicating whether the server is working correctly.
 *     tags:
 *       - Default
 *     responses:
 *       200:
 *         description: The server is functioning normally.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 message:
 *                   type: string
 *                   example: "Healthy"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get(
	"/",
	authMiddleware({ requireAuth: isProduction ? true : false }),
	healthController
);

export default router;
