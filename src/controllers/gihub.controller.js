import { setCookieAccessToken } from "../utils/cookies.js";
import { app, isProduction } from "../utils/environment.js";

export const getGithub = (req, res) => {
	const redirectURI = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;
	res.redirect(redirectURI);
};

export const getGitHubCallback = async (req, res) => {
	const { code, error } = req.query;

	if (error) {
		return res.redirect(
			`${
				isProduction ? app.url.production : app.url.development
			}/login?error=github_auth_failed`
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
			return res.redirect(
				`${
					isProduction ? app.url.production : app.url.development
				}/login?error=invalid_token`
			);
		}

		const accessToken = tokenData.access_token;
		const userResponse = await fetch("https://api.github.com/user", {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		const user = await userResponse.json();
		if (!user.id) {
			return res.redirect(
				`${
					isProduction ? app.url.production : app.url.development
				}/login?error=user_not_found`
			);
		}

		//TODO: create an endpoint to refresh token when is expired
		setCookieAccessToken(res, accessToken);

		return res.redirect(
			`${
				isProduction ? app.url.production : app.url.development
			}/dashboard?success=github_auth_success`
		);
	} catch (error) {
		return res.redirect(
			`${
				isProduction ? app.url.production : app.url.development
			}/login?error=server_error`
		);
	}
};
