import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import routes from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { swaggerRoute } from "./config/swagger.js";
import { limiterOptions } from "./config/limiter.js";
import { corsOptions } from "./config/cors.js";
import { helmetOptions } from "./config/helmet.js";
import { compressionOptions } from "./config/compression.js";
import { isProduction } from "./utils/environment.js";
import { httpLogger } from "./config/morgan.js";

const app = express();

if (!isProduction) {
	dotenv.config();
	app.use(httpLogger);
	app.use("/api", swaggerRoute);
} else {
	app.use(limiterOptions);
}

app.use(cookieParser());
app.use(helmet(helmetOptions));
app.use(cors(corsOptions));
app.use(compression(compressionOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);
app.use(errorMiddleware);

export default app;
