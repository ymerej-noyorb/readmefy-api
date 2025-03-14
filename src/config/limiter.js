import rateLimit from "express-rate-limit";
import { isProduction } from "../utils/environment.js";

export const limiterOptions = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
	skip: (req, res) => !isProduction,
});
