import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";
import { app } from "../utils/environment.js";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const packageJson = require("../../package.json");
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: packageJson.name,
			version: packageJson.version,
			description: packageJson.description,
		},
		servers: [
			{
				url: app.url,
				description: "Local server",
			},
		],
		components: {
			securitySchemes: {
				CookieAuth: {
					type: "apiKey",
					in: "cookie",
					name: "READMEFY_TOKEN",
				},
			},
		},
	},
	apis: [
		path.join(__dirname, "../docs/*.yaml"),
		path.join(__dirname, "../routes/*.js"),
	],
};

const swaggerSpec = swaggerJSDoc(options);
export const swaggerRoute = express.Router();

swaggerRoute.use(
	"/docs",
	swaggerUi.serve,
	swaggerUi.setup(swaggerSpec, {
		customSiteTitle: "API documentation | Readmefy",
		customfavIcon: "https://i.imgur.com/I6S586o.png",
		swaggerOptions: {
			withCredentials: true,
		},
	})
);
