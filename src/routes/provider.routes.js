import express from "express";
import { gitHubController } from "../controllers/provider.controller.js";

const router = express.Router();

router.get("/github", gitHubController);

export default router;
