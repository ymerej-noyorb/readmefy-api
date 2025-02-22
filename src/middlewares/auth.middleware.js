import {
	verifyToken,
	verifyRefreshToken,
	generateAccessToken,
} from "../utils/token.js";
import {
	getCookieAccessToken,
	getCookieRefreshToken,
	setCookieAccessToken,
	setCookieRefreshToken,
} from "../utils/cookies.js";

const tokenHandler = async (req, res, next) => {
	try {
		const accessToken = getCookieAccessToken(req);
		if (!accessToken) {
			return res
				.status(401)
				.json({ success: false, message: "No token provided" });
		}

		try {
			const decoded = await verifyToken(accessToken);
			req.user = decoded;
			next();
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				const refreshToken = getCookieRefreshToken(req);
				if (!refreshToken) {
					return res
						.status(403)
						.json({ success: false, message: "Refresh token required" });
				}

				try {
					const decodedRefresh = await verifyRefreshToken(refreshToken);
					const newAccessToken = generateAccessToken({ id: decodedRefresh.id });

					setCookieAccessToken(res, newAccessToken);
					setCookieRefreshToken(res, refreshToken);
					req.user = decodedRefresh;
					return res.status(200).json({
						success: true,
						message: "Token refreshed",
						user: req.user,
					});
				} catch (error) {
					return res
						.status(403)
						.json({ success: false, message: "Invalid refresh token" });
				}
			} else {
				return res
					.status(401)
					.json({ success: false, message: "Invalid token" });
			}
		}

		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: "Authentication middleware error" });
	}
};

export default tokenHandler;
