import express from "express";
import healthRoute from "./health.routes.js";
import authRoute from "./auth.routes.js";

const router = express.Router();

router.use("/health", healthRoute);
router.use("/auth", authRoute);

export default router;
