import {
	getCookieAccessToken,
	setCookieAccessToken,
	clearCookieAccessToken,
} from "../utils/cookies.js";
import { getJwtToken, setJwtToken, verifyJwtToken } from "../utils/jwt.js";
import { logger } from "../config/winston.js";

export const authMiddleware = ({
	requireAuth = false,
	blockIfAuthenticated = false,
} = {}) => {
	return (req, res, next) => {
		logger.debug("Auth middleware started...");

		const token = getCookieAccessToken(req);
		logger.debug(`Token found: ${token ? "Yes" : "No"}`);

		if (blockIfAuthenticated && token) {
			logger.warn("User already authenticated, access denied.");
			return res.status(403).json({
				success: false,
				message: "You are already authenticated.",
				data: {},
			});
		}

		if (requireAuth) {
			if (!token) {
				logger.warn("Token missing from request");
				return res.status(401).json({
					success: false,
					message: "No token provided",
					data: {},
				});
			}

			try {
				logger.debug("Verifying JWT token...");
				const decoded = verifyJwtToken(token);
				logger.debug("Token verified successfully:", decoded);
				req.user = decoded;
				logger.debug("Calling next() after successful verification");
				return next();
			} catch (err) {
				logger.error("Error verifying JWT token:", err);

				if (err.name === "TokenExpiredError") {
					logger.warn("Token expired. Attempting to refresh...");

					try {
						const decoded = getJwtToken(token);
						logger.debug("Old token decoded:", decoded);

						const newToken = setJwtToken({
							readmefy_id: decoded.readmefy_id,
							provider_id: decoded.provider_id,
						});

						setCookieAccessToken(res, newToken);
						logger.info("New JWT token generated and set in cookie");
						req.user = decoded;
						logger.debug("Calling next() after token refresh");
						return next();
					} catch (err) {
						logger.error("Failed to refresh expired token:", err);
						clearCookieAccessToken(res);
						return res.status(401).json({
							success: false,
							message: "Invalid token",
							data: {},
						});
					}
				} else {
					logger.error("Invalid JWT token:", err);
					clearCookieAccessToken(res);
					return res.status(401).json({
						success: false,
						message: "Invalid token",
						data: {},
					});
				}
			}
		}

		logger.debug("No authentication required, calling next()");
		next();
		logger.debug("Auth middleware ended.");
	};
};
