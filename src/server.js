import app from "./app.js";

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
	console.log(`🚀 Server is running on port ${PORT}`);
});
