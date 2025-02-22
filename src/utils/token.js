import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
	return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
		expiresIn: "24h", // 24 heures
	});
};

export const generateRefreshToken = (user) => {
	return jwt.sign({ id: user.id }, process.env.REFRESH_JWT_SECRET, {
		expiresIn: "7d", // 7 jours
	});
};

export const verifyToken = async (token) =>
	jwt.verify(token, process.env.JWT_SECRET);

export const verifyRefreshToken = async (refreshToken) =>
	jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
