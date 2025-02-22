import express from "express";
import healthRoute from "./health.routes.js";
import authRoute from "./auth.routes.js";
import userRoute from "./user.routes.js";

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Operations related to user authentication
 *   - name: User Management
 *     description: Operations related to managing user data and session
 *   - name: Default
 *     description: General-purpose operations
 */
const router = express.Router();

router.use("/health", healthRoute);
router.use("/auth", authRoute);
router.use("/user", userRoute);

export default router;
