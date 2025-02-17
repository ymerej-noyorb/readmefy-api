import express from "express";
import healthRoute from "./health.routes.js";

const router = express.Router();

router.use("/health", healthRoute);

export default router;
