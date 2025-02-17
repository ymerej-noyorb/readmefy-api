import express from "express";
import { getHealth } from "../controllers/health.controller.js";

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check server status
 *     description: Returns a message indicating whether the server is working correctly.
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
router.get("/", getHealth);

export default router;
