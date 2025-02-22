import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
	return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
		expiresIn: "24h",
	});
};

export const generateRefreshToken = (user) => {
	return jwt.sign({ id: user.id }, process.env.REFRESH_JWT_SECRET, {
		expiresIn: "7d",
	});
};

export const verifyToken = async (token) =>
	jwt.verify(token, process.env.JWT_SECRET);

export const verifyRefreshToken = async (refreshToken) =>
	jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
