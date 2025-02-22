import {
	clearCookieAuthStatus,
	getCookieAuthStatus,
} from "../../utils/cookies.js";

export const getAuthStatus = (req, res) => {
	const authStatus = getCookieAuthStatus(req);
	if (!authStatus) {
		return res.status(204).send();
	}

	clearCookieAuthStatus(res);
	return res.json(JSON.parse(authStatus));
};
