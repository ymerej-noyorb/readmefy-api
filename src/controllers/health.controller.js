import os from "os";
import { isProduction } from "../utils/environment.js";

export const getHealth = async (req, res) => {
	const token =
		req.headers.authorization && req.headers.authorization.split(" ")[1];
	if (isProduction && (!token || token !== process.env.READMEFY_TOKEN)) {
		return res.status(403).json({
			success: false,
			message: "Invalid or missing Bearer token",
			data: {},
		});
	}

	try {
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
			},
		});
	} catch (err) {
		console.error("Health check error:", err);
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
