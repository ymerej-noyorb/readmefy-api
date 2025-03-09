import { setCookieAccessToken } from "../utils/cookies.js";
import { app, isProduction } from "../utils/environment.js";
import { setJwtToken } from "../utils/jwt.js";

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
			}/login?provider=github&error=github_auth_failed&message=GitHub authentication failed`
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
				}/login?provider=github&error=invalid_token&message=Invalid GitHub access token`
			);
		}

		const githubToken = tokenData.access_token;
		const userResponse = await fetch("https://api.github.com/user", {
			headers: { Authorization: `Bearer ${githubToken}` },
		});

		const user = await userResponse.json();
		if (!user.id) {
			return res.redirect(
				`${
					isProduction ? app.url.production : app.url.development
				}/login?provider=github&error=user_not_found&message=GitHub user not found`
			);
		}

		const readmefyToken = setJwtToken({
			id: user.id,
			login: user.login,
			email: user.email,
		});
		setCookieAccessToken(res, readmefyToken);
		//TODO: Create a middleware for every routes to refresh token if during a request of a user, his token is expired

		return res.redirect(
			`${isProduction ? app.url.production : app.url.development}/dashboard`
		);
	} catch (error) {
		return res.redirect(
			`${
				isProduction ? app.url.production : app.url.development
			}/login?provider=github&error=server_error&message=An error occurred during GitHub authentication`
		);
	}
};
