import { isProduction } from "../utils/environment.js";

const helmetOptions = {
	contentSecurityPolicy: isProduction ? true : false,
};

export default helmetOptions;
