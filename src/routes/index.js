import express from "express";
import healthRoute from "./health.routes.js";
import authRoute from "./auth.routes.js";
import providerRoute from "./provider.routes.js";
import userRoute from "./user.routes.js";

const router = express.Router();

router.use("/health", healthRoute);
router.use("/auth", authRoute);
router.use("/provider", providerRoute);
router.use("/user", userRoute);

export default router;
