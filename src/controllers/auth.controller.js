import { logger } from "../config/winston.js";
import { clearCookieAccessToken } from "../utils/cookies.js";

export const loginController = (req, res) => {
	const { provider } = req.query;
	if (!provider) {
		logger.warn("Provider not found in the request.");
		return res.status(400).json({
			success: false,
			message: "Provider is missing or invalid",
			data: {},
		});
	}

	let redirectURI = "";
	switch (provider) {
		case "github":
			redirectURI = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;
			break;
		case "gitlab":
			redirectURI = `https://gitlab.com/oauth/authorize?client_id=${process.env.GITLAB_CLIENT_ID}&response_type=code&redirect_uri=${process.env.GITLAB_REDIRECT_URI}&scope=read_user`;
			break;
		case "discord":
			redirectURI = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&response_type=code&scope=identify email&redirect_uri=${process.env.DISCORD_REDIRECT_URI}`;
			break;
		case "google":
			redirectURI = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&response_type=code&scope=email profile&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}`;
			break;
		default:
			logger.warn(`Unsupported provider: ${provider}`);
			return res.status(400).json({
				success: false,
				message: `Provider '${provider}' is not supported`,
				data: {},
			});
	}

	logger.debug(`Redirecting to ${provider} OAuth:`, redirectURI);
	res.redirect(redirectURI);
};

export const logoutController = (req, res) => {
	try {
		clearCookieAccessToken(res);
		return res
			.status(200)
			.json({ success: true, message: "Logout successful", data: {} });
	} catch (err) {
		logger.error("Logout error:", err);
		return res.status(500).json({
			success: false,
			message: "An error occurred during logout",
			data: {},
		});
	}
};
