import { isProduction } from "./environment.js";

export const setCookieAuthStatus = (
	res,
	status,
	provider,
	type,
	message,
	options = {
		httpOnly: true,
		secure: isProduction ? true : false,
		maxAge: 10000,
	}
) => {
	return res.cookie(
		"AUTH_STATUS",
		JSON.stringify({
			success: status,
			provider: provider,
			type: type,
			message: message,
		}),
		options
	);
};

export const getCookieAuthStatus = (req) => {
	return req.cookies.AUTH_STATUS;
};

export const clearCookieAuthStatus = (res) => {
	return res.clearCookie("AUTH_STATUS", { sameSite: "Strict" });
};

export const setCookieAuthToken = (
	res,
	token,
	options = {
		httpOnly: true,
		secure: isProduction ? true : false,
		sameSite: "Strict",
	}
) => {
	return res.cookie("AUTH_TOKEN", token, options);
};

export const getCookieAuthToken = (req) => {
	return req.cookies.AUTH_TOKEN;
};

export const clearCookieAuthToken = (res) => {
	return res.clearCookie("AUTH_TOKEN", { sameSite: "Strict" });
};
