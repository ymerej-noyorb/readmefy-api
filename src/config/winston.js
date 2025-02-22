import winston from "winston";
import { isProduction } from "../utils/environment.js";

const logger = winston.createLogger({
	level: "info",
	format: winston.format.json(),
	transports: [
		new winston.transports.File({ filename: "logs/error.log", level: "error" }),
		new winston.transports.File({ filename: "logs/combined.log" }),
	],
});

if (!isProduction) {
	logger.add(
		new winston.transports.Console({ format: winston.format.simple() })
	);
}

export default logger;
