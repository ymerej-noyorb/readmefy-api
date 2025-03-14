import lodash from "lodash";
import { logger } from "../config/winston.js";
import {
	getUserByProviderId,
	insertUser,
	updateUser,
} from "../services/user.js";
import { setCookieAccessToken } from "../utils/cookies.js";
import { app } from "../utils/environment.js";
import { setJwtToken } from "../utils/jwt.js";

export const gitHubController = (req, res) => {
	const redirectURI = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;
	logger.debug("Redirecting to GitHub OAuth:", redirectURI);
	res.redirect(redirectURI);
};

export const gitHubCallbackController = async (req, res) => {
	const { code, error } = req.query;
	logger.debug("GitHub callback received:", { code, error });

	if (error) {
		logger.error("GitHub authentication error:", { error });
		return res.redirect(
			`${app.url}/login?provider=github&error=github_auth_failed&message=GitHub authentication failed`
		);
	}

	try {
		logger.debug("Requesting GitHub access token...");
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
		logger.debug("GitHub token response:", tokenData);

		if (tokenData.error) {
			logger.error("Invalid GitHub token:", tokenData.error);
			return res.redirect(
				`${app.url}/login?provider=github&error=invalid_token&message=Invalid GitHub access token`
			);
		}

		const githubToken = tokenData.access_token;
		logger.debug("GitHub access token received");

		const userResponse = await fetch("https://api.github.com/user", {
			headers: { Authorization: `Bearer ${githubToken}` },
		});

		const user = await userResponse.json();
		logger.debug("GitHub user data:", user);

		if (!user.id) {
			logger.error("GitHub user not found");
			return res.redirect(
				`${app.url}/login?provider=github&error=user_not_found&message=GitHub user not found`
			);
		}

		let databaseUser = await getUserByProviderId("github", user.id);
		logger.debug("Database user lookup:", databaseUser);

		if (!databaseUser) {
			logger.warn("User not found in DB, inserting...");
			const newUser = {
				provider_name: "github",
				provider_data: JSON.stringify(user),
				provider_id: user.id,
				provider_username: user.login,
				provider_email: user.email,
				provider_avatar: user.avatar_url,
			};
			const insertedUser = await insertUser(newUser);
			logger.debug("New user inserted:", insertedUser);
			databaseUser = { readmefy_id: insertedUser.readmefy_id, ...newUser };
		} else {
			const updates = {};
			let needsUpdate = false;

			if (!lodash.isEqual(databaseUser.provider_data, user)) {
				updates.provider_data = JSON.stringify(user);
				needsUpdate = true;
			}
			if (databaseUser.provider_username !== user.login) {
				updates.provider_username = user.login;
				needsUpdate = true;
			}
			if (databaseUser.provider_email !== user.email) {
				updates.provider_email = user.email;
				needsUpdate = true;
			}
			if (databaseUser.provider_avatar !== user.avatar_url) {
				updates.provider_avatar = user.avatar_url;
				needsUpdate = true;
			}

			if (needsUpdate) {
				logger.debug(
					"User data has changed, updating specific fields...",
					updates
				);
				await updateUser(databaseUser.readmefy_id, updates);
			} else {
				logger.debug("No changes detected in user data.");
			}
		}

		logger.debug("Generating JWT with data:", {
			readmefy_id: databaseUser.readmefy_id,
			provider_id: databaseUser.provider_id,
		});

		const readmefyToken = setJwtToken({
			readmefy_id: databaseUser.readmefy_id,
			provider_id: databaseUser.provider_id,
		});
		logger.debug("JWT Token generated:", readmefyToken);

		setCookieAccessToken(res, readmefyToken);
		logger.debug("Cookie set, redirecting to dashboard");
		return res.redirect(`${app.url}/dashboard`);
	} catch (err) {
		logger.error("Server error during GitHub authentication:", err);
		return res.redirect(
			`${app.url}/login?provider=github&error=server_error&message=An error occurred during GitHub authentication`
		);
	}
};
