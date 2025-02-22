import { app, isProduction } from "../utils/environment.js";

const corsOptions = {
	origin: isProduction ? app.url.production : app.url.development,
	credentials: true,
};

export default corsOptions;
