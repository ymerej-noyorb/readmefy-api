import { logger } from "../config/winston.js";
import { getUserByUserId } from "../services/user.js";
import { getCookieAccessToken } from "../utils/cookies.js";
import { verifyJwtToken } from "../utils/jwt.js";

export const userController = async (req, res) => {
	const token = getCookieAccessToken(req);

	try {
		if (!token) {
			logger.warn("Token not found in the request.");
			return res.status(401).json({
				success: false,
				message: "Token is missing or invalid",
				data: {},
			});
		}

		const decoded = verifyJwtToken(token);
		logger.debug("Decoded JWT:", decoded);

		const user = await getUserByUserId(decoded.readmefy_id);
		logger.debug("User data retrieved:", user);

		if (!user) {
			logger.warn("No user found with the provided readmefy_id.");
			return res.status(404).json({
				success: false,
				message: "User not found",
				data: {},
			});
		}

		return res.status(200).json({
			success: true,
			message: "User successfully retrieved",
			data: {
				user: user,
			},
		});
	} catch (err) {
		logger.error("Error occurred:", err);
		return res.status(500).json({
			success: false,
			message: "An error occurred while fetching user",
			data: {},
		});
	}
};
