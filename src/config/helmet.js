import { isProduction } from "../utils/environment.js";

const helmetOptions = {
	contentSecurityPolicy: isProduction,
};

export default helmetOptions;
