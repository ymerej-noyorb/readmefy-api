import jwt from "jsonwebtoken";

export const setJwtToken = (user) => {
	return jwt.sign(user, process.env.READMEFY_SECRET, { expiresIn: "1d" });
};
