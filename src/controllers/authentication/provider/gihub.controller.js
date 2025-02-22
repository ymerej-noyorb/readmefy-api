import {
	setCookieAuthStatus,
	setCookieAccessToken,
	setCookieRefreshToken,
} from "../../../utils/cookies.js";
import { app, isProduction } from "../../../utils/environment.js";
import {
	generateAccessToken,
	generateRefreshToken,
} from "../../../utils/token.js";

export const getGithub = (req, res) => {
	const redirectURI = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;
	res.redirect(redirectURI);
};

export const getGitHubCallback = async (req, res) => {
	const { code, error, error_description } = req.query;

	if (error) {
		setCookieAuthStatus(
			res,
			false,
			"GitHub",
			error,
			error_description || "An unknown error occurred"
		);
		return res
			.status(400)
			.redirect(
				`${isProduction ? app.url.production : app.url.development}/login`
			);
	}

	try {
		const tokenResponse = await fetch(
			"https://github.com/login/oauth/access_token",
			{
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					client_id: process.env.GITHUB_CLIENT_ID,
					client_secret: process.env.GITHUB_CLIENT_SECRET,
					code: code,
				}),
			}
		);

		const tokenData = await tokenResponse.json();
		if (tokenData.error) {
			setCookieAuthStatus(
				res,
				false,
				"GitHub",
				tokenData.error,
				tokenData.error_description || "Failed to retrieve access token"
			);
			return res
				.status(400)
				.redirect(
					`${isProduction ? app.url.production : app.url.development}/login`
				);
		}

		const accessToken = tokenData.access_token;
		const userResponse = await fetch("https://api.github.com/user", {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		const user = await userResponse.json();
		if (!user.id) {
			setCookieAuthStatus(
				res,
				false,
				"GitHub",
				"invalid_user_data",
				"Failed to retrieve valid user information"
			);
			return res
				.status(400)
				.redirect(
					`${isProduction ? app.url.production : app.url.development}/login`
				);
		}

		const token = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);
		setCookieAccessToken(res, token);
		setCookieRefreshToken(res, refreshToken);
		setCookieAuthStatus(
			res,
			true,
			"GitHub",
			"auth_success",
			"Successfully connected to GitHub"
		);

		return res
			.status(200)
			.redirect(
				`${isProduction ? app.url.production : app.url.development}/login`
			);
	} catch (error) {
		setCookieAuthStatus(
			res,
			false,
			"GitHub",
			error.name || "unknown_error",
			error.message || "An unexpected error occurred"
		);
		return res
			.status(500)
			.redirect(
				`${isProduction ? app.url.production : app.url.development}/login`
			);
	}
};
