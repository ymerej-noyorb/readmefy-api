import { app } from "../utils/environment.js";

export const corsOptions = {
	origin: app.url,
	credentials: true,
};
