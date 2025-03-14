import { isProduction } from "../utils/environment.js";

export const helmetOptions = {
	contentSecurityPolicy: isProduction,
};
