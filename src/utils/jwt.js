import jwt from "jsonwebtoken";

export const setJwtToken = (user) => {
	return jwt.sign(user, process.env.READMEFY_SECRET, { expiresIn: "1d" });
};

export const getJwtToken = (token) => {
	return jwt.decode(token);
};

export const verifyJwtToken = (token) => {
	return jwt.verify(token, process.env.READMEFY_SECRET);
};
