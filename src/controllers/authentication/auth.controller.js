import {
	clearCookieAuthStatus,
	getCookieAuthStatus,
	getCookieAuthToken,
} from "../../utils/cookies.js";
import { verifyToken } from "../../utils/token.js";

export const getAuthStatus = (req, res) => {
	const authStatus = getCookieAuthStatus(req);
	if (!authStatus) {
		return res.status(204).send();
	}

	clearCookieAuthStatus(res);
	return res.json(JSON.parse(authStatus));
};

export const getUser = (req, res) => {
	const token = getCookieAuthToken(req);

	if (!token) {
		return res.status(401).json({ success: false, message: "No token found" });
	}

	try {
		const decoded = verifyToken(token);
		return res.status(200).json({ success: true, user: decoded });
	} catch (error) {
		console.error("JWT verification failed:", error);
		return res.status(401).json({ success: false, message: "Invalid token" });
	}
};
