export const isProduction = process.env.READMEFY_ENV === "production";
export const app = {
	url: {
		development: "http://localhost:5173",
		production: "https://readmefy.app",
	},
};
