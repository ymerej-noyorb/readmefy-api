import express from "express";
import { gitHubController } from "../controllers/provider.controller.js";
import { authMiddleware } from "../middlewares/token.middleware.js";

const router = express.Router();

router.get("/github", authMiddleware(), gitHubController);

export default router;
