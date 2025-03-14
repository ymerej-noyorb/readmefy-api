import winston from "winston";
import { isProduction } from "../utils/environment.js";

const consoleFormat = winston.format.combine(
	winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
	winston.format.colorize(),
	winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
		const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";

		const serviceStr = service ? `[${service}] ` : "";
		return `${timestamp} ${serviceStr}${level}: ${message}${metaStr}`;
	})
);

const fileFormat = winston.format.combine(
	winston.format.timestamp(),
	winston.format.errors({ stack: true }),
	winston.format.json()
);

export const logger = winston.createLogger({
	level: isProduction ? "info" : "debug",
	defaultMeta: { service: "readmefy-api" },
	transports: [
		new winston.transports.File({
			filename: "logs/error.log",
			level: "error",
			format: fileFormat,
		}),
		new winston.transports.File({
			filename: "logs/combined.log",
			format: fileFormat,
		}),
		new winston.transports.File({
			filename: "logs/http.log",
			level: "http",
			format: fileFormat,
		}),
	],
	exceptionHandlers: [
		new winston.transports.File({
			filename: "logs/exceptions.log",
			format: fileFormat,
		}),
	],
	exitOnError: false,
});

if (!isProduction) {
	logger.add(
		new winston.transports.Console({
			format: consoleFormat,
		})
	);
}

const symbols = {
	success: "✅ ",
	info: "ℹ️ ",
	debug: "🔍 ",
	http: "🌍 ",
	warn: "⚠️ ",
	error: "❌ ",
	fatal: "💥 ",
};

logger.success = (message, meta = {}) =>
	logger.info(`${symbols.success} ${message}`, meta);
logger.fatal = (message, meta = {}) =>
	logger.error(`${symbols.fatal} ${message}`, meta);

const originalFunctions = ["info", "debug", "warn", "error", "http"];
originalFunctions.forEach((level) => {
	const originalFunction = logger[level];
	logger[level] = (message, meta = {}) => {
		return originalFunction(`${symbols[level]} ${message}`, meta);
	};
});
