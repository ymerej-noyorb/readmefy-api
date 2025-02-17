const corsOptions = {
	origin: process.env.NODE_ENV === "production" ? process.env.CORS_ORIGIN : "*",
};

export default corsOptions;
