import { isProduction } from "./environment.js";

export const setCookieAccessToken = (
	res,
	token,
	options = {
		httpOnly: true,
		secure: isProduction,
		sameSite: "Strict",
		maxAge: 25 * 60 * 60 * 1000, // 25 heures
	}
) => {
	return res.cookie("GITHUB_TOKEN", token, options);
};

export const getCookieAccessToken = (req) => {
	return req.cookies.GITHUB_TOKEN;
};

export const clearCookieAccessToken = (res) => {
	return res.clearCookie("GITHUB_TOKEN", { sameSite: "Strict" });
};
