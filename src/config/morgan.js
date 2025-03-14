import morgan from "morgan";
import chalk from "chalk";
import { logger } from "./winston.js";
import { isProduction } from "../utils/environment.js";

morgan.token("colored-status", (req, res) => {
	const status = res.statusCode;

	if (status < 300) return chalk.green(status);
	if (status < 400) return chalk.cyan(status);
	if (status < 500) return chalk.yellow(status);
	return chalk.red(status);
});

morgan.token("response-time-colored", (req, res) => {
	const time = morgan["response-time"](req, res);
	const ms = parseFloat(time);

	if (ms < 10) return chalk.green(`${ms} ms`);
	if (ms < 100) return chalk.yellow(`${ms} ms`);
	return chalk.red(`${ms} ms`);
});

const devFormat = ":method :url :colored-status :response-time-colored";

const prodFormat =
	":remote-addr - :method :url :status :response-time ms - :res[content-length]";

const httpLogStream = {
	write: (message) => {
		const log = message.trim();

		logger.http(log);
	},
};

export const httpLogger = morgan(isProduction ? prodFormat : devFormat, {
	stream: httpLogStream,
	skip: (req, res) => false,
});
