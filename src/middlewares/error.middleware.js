import { logger } from "../config/winston.js";

export const errorMiddleware = (err, req, res, next) => {
	logger.error(err.stack);
	logger.error(err.message);
	res.status(err.status || 500).json({
		success: false,
		message: err.message || "Internal server error",
	});
};
