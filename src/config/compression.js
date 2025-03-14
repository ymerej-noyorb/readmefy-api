import compression from "compression";

export const compressionOptions = {
	level: 6,
	threshold: 1024,
	filter: (req, res) => {
		if (req.headers["x-no-compression"]) {
			return false;
		}
		return compression.filter(req, res);
	},
};
