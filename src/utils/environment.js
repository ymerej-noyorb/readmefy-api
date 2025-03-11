export const isProduction = process.env.READMEFY_ENV === "production";
export const app = {
	url: isProduction ? "https://readmefy.app" : "http://readmefy.localhost",
};
