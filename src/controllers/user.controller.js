import {
	clearCookieAccessToken,
	getCookieAccessToken,
} from "../utils/cookies.js";

export const getUser = async (req, res) => {
	const accessToken = getCookieAccessToken(req);

	if (!accessToken) {
		return res.status(401).json({ authenticated: false, user: null });
	}

	try {
		const userResponse = await fetch("https://api.github.com/user", {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		const user = await userResponse.json();

		if (!user.id) {
			return res.status(401).json({ authenticated: false, user: null });
		}

		return res.json({ authenticated: true, user });
	} catch (error) {
		return res.status(500).json({ authenticated: false, user: null });
	}
};

export const removeUser = (req, res) => {
	const accessToken = getCookieAccessToken(req);

	if (!accessToken) {
		return res.status(401).json({ authenticated: false, user: null });
	}

	clearCookieAccessToken(res);
	return res.json({ authenticated: false, user: null });
};
