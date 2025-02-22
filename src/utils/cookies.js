import { isProduction } from "./environment.js";

export const setCookieAuthStatus = (
	res,
	status,
	provider,
	type,
	message,
	options = {
		httpOnly: true,
		secure: isProduction,
		maxAge: 5 * 60 * 1000,
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

export const setCookieAccessToken = (
	res,
	token,
	options = {
		httpOnly: true,
		secure: isProduction,
		sameSite: "Strict",
		maxAge: 25 * 60 * 60 * 1000,
	}
) => {
	return res.cookie("ACCESS_TOKEN", token, options);
};

export const setCookieRefreshToken = (
	res,
	refreshToken,
	options = {
		httpOnly: true,
		secure: isProduction,
		sameSite: "Strict",
		maxAge: 8 * 24 * 60 * 60 * 1000,
	}
) => {
	return res.cookie("REFRESH_TOKEN", refreshToken, options);
};

export const getCookieAuthStatus = (req) => {
	return req.cookies.AUTH_STATUS;
};

export const getCookieAccessToken = (req) => {
	return req.cookies.ACCESS_TOKEN;
};

export const getCookieRefreshToken = (req) => {
	return req.cookies.REFRESH_TOKEN;
};

export const clearCookieAuthStatus = (res) => {
	return res.clearCookie("AUTH_STATUS", { sameSite: "Strict" });
};

export const clearCookieAccessToken = (res) => {
	return res.clearCookie("ACCESS_TOKEN", { sameSite: "Strict" });
};

export const clearCookieRefreshToken = (res) => {
	return res.clearCookie("REFRESH_TOKEN", { sameSite: "Strict" });
};
