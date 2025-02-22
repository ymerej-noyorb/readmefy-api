import {
	clearCookieAccessToken,
	clearCookieAuthStatus,
	clearCookieRefreshToken,
} from "../utils/cookies.js";

export const getUser = async (req, res) => {
	if (!req.user) {
		return res
			.status(401)
			.json({ success: false, message: "No user data found" });
	}

	return res.status(200).json({
		success: true,
		message: "User data retrieved successfully",
		user: req.user,
	});
};

export const getUserLogout = async (req, res) => {
	if (!req.user) {
		return res
			.status(401)
			.json({ success: false, message: "No user data found" });
	}

	clearCookieAuthStatus(res);
	clearCookieAccessToken(res);
	clearCookieRefreshToken(res);

	return res.status(200).json({
		success: true,
		message: "User logged out successfully",
	});
};
