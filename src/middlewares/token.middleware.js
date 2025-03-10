import {
	getCookieAccessToken,
	setCookieAccessToken,
	clearCookieAccessToken,
} from "../utils/cookies.js";
import { getJwtToken, setJwtToken, verifyJwtToken } from "../utils/jwt.js";

export const handleToken = (req, res, next) => {
	const token = getCookieAccessToken(req);

	if (!token) {
		return res.status(401).json({
			success: false,
			message: "Token missing",
			data: {},
		});
	}

	try {
		const decoded = verifyJwtToken(token);
		req.user = decoded;
		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			try {
				const decoded = getJwtToken(token);
				const newToken = setJwtToken({
					id: decoded.id,
					login: decoded.login,
					email: decoded.email,
				});

				setCookieAccessToken(res, newToken);
				req.user = decoded;
				next();
			} catch (err) {
				clearCookieAccessToken(res);
				return res
					.status(401)
					.json({ success: false, message: "Invalid token", data: {} });
			}
		} else {
			clearCookieAccessToken(res);
			return res
				.status(401)
				.json({ success: false, message: "Invalid token", data: {} });
		}
	}
};
