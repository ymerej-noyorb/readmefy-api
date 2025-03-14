import os from "os";
import { databaseIsHealthy } from "../config/database.js";
import { logger } from "../config/winston.js";

export const healthController = async (req, res) => {
	try {
		let databaseStatus = "healthy";
		let databaseResponseTime = null;

		try {
			const start = Date.now();
			await databaseIsHealthy();
			databaseResponseTime = Date.now() - start;
		} catch (err) {
			logger.error("Database unhealthy:", err);
			databaseStatus = "unhealthy";
		}

		res.status(200).json({
			success: true,
			message: "Server is running and healthy",
			data: {
				meta: {
					version: process.env.npm_package_version || "unknown",
					environment: process.env.READMEFY_ENV || "development",
					timestamp: new Date().toISOString(),
					uptime: process.uptime(),
				},
				system: {
					memory: {
						total: os.totalmem(),
						free: os.freemem(),
						usage: process.memoryUsage().rss,
					},
					cpu: {
						loadAverage: os.loadavg(),
					},
				},
				database: {
					status: databaseStatus,
					responseTime: databaseResponseTime,
				},
			},
		});
	} catch (err) {
		logger.error("Health check error:", err);
		res.status(500).json({
			status: false,
			message: "Internal server error",
			data: {
				code: err.code || "UNKNOWN_ERROR",
				name: err.name || "HealthCheckError",
				message: err.message || "An unexpected error occurred",
				stack: err.stack || null,
			},
		});
	}
};
