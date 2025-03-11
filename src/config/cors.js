import { app } from "../utils/environment.js";

const corsOptions = {
	origin: app.url,
	credentials: true,
};

export default corsOptions;
