import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
	return jwt.sign(
		{ id: user.id, username: user.login },
		process.env.JWT_SECRET,
		{
			expiresIn: "1h",
		}
	);
};

export const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
