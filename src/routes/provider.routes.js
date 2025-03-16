import express from "express";
import { gitHubController } from "../controllers/provider.controller.js";
import { authMiddleware } from "../middlewares/token.middleware.js";

const router = express.Router();

//TODO: Add Swagger comments
router.get("/github", authMiddleware(), gitHubController);

export default router;
