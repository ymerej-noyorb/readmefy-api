import { logger } from "../config/winston.js";
import {
	compareUser,
	getUserByProviderId,
	insertUser,
	updateUser,
} from "../services/user.js";
import { setCookieAccessToken } from "../utils/cookies.js";
import { app } from "../utils/environment.js";
import { setJwtToken } from "../utils/jwt.js";

export const gitHubController = async (req, res) => {
	const { code, error } = req.query;
	logger.debug("GitHub callback received:", { code, error });

	if (error) {
		logger.error("GitHub authentication error:", { error });
		return res.redirect(
			`${app.url}/login/callback?provider=github&error=github_auth_failed&message=GitHub authentication failed`
		);
	}

	try {
		logger.debug("Requesting GitHub access token...");
		const githubTokenResponse = await fetch(
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

		const providerTokenData = await githubTokenResponse.json();
		logger.debug("GitHub token response:", providerTokenData);

		if (providerTokenData.error) {
			logger.error("Invalid GitHub token:", providerTokenData.error);
			return res.redirect(
				`${app.url}/login/callback?provider=github&error=invalid_token&message=Invalid GitHub access token`
			);
		}

		const providerToken = providerTokenData.access_token;
		logger.debug("GitHub access token received");

		const userResponse = await fetch("https://api.github.com/user", {
			headers: { Authorization: `Bearer ${providerToken}` },
		});

		const providerUser = await userResponse.json();
		logger.debug("GitHub user data:", providerUser);

		if (!providerUser.id) {
			logger.error("GitHub user not found");
			return res.redirect(
				`${app.url}/login/callback?provider=github&error=user_not_found&message=GitHub user not found`
			);
		}

		let databaseUser = await getUserByProviderId("github", providerUser.id);
		logger.debug("Database user lookup:", databaseUser);

		if (!databaseUser) {
			logger.warn("User not found in DB, inserting...");
			const newUser = {
				provider_name: "github",
				provider_data: JSON.stringify(providerUser),
				provider_id: providerUser.id,
				provider_username: providerUser.login,
				provider_email: providerUser.email,
				provider_avatar: providerUser.avatar_url,
			};
			const insertedUser = await insertUser(newUser);
			logger.debug("New user inserted:", insertedUser);
			databaseUser = { id: insertedUser.id, ...newUser };
		} else {
			const updates = compareUser(databaseUser, providerUser, "github");

			if (Object.keys(updates).length > 0) {
				logger.debug(
					"User data has changed, updating specific fields...",
					updates
				);
				await updateUser(databaseUser.id, updates);
			} else {
				logger.debug("No changes detected in user data.");
			}
		}

		logger.debug("Generating JWT with data:", {
			readmefy_id: databaseUser.id,
			provider_id: databaseUser.provider_id,
		});

		const readmefyToken = setJwtToken({
			readmefy_id: databaseUser.id,
			provider_id: databaseUser.provider_id,
		});
		logger.debug("JWT Token generated:", readmefyToken);

		setCookieAccessToken(res, readmefyToken);
		logger.debug("Cookie set, redirecting to callback");
		return res.redirect(`${app.url}/login/callback`);
	} catch (err) {
		logger.error("Server error during GitHub authentication:", err);
		return res.redirect(
			`${app.url}/login/callback?provider=github&error=server_error&message=An error occurred during GitHub authentication`
		);
	}
};
