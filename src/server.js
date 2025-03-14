import app from "./app.js";
import { databaseIsHealthy, createTables } from "./config/database.js";
import { logger } from "./config/winston.js";

const PORT = 3000;
const start = async () => {
	try {
		await databaseIsHealthy();
		logger.debug("Successfully connected to database");

		await createTables();
		logger.debug("Tables are set up");

		app.listen(PORT, "0.0.0.0", () => {
			logger.debug(`Server is running on port ${PORT}`);
		});
	} catch (err) {
		logger.error(err);
		process.exit(1);
	}
};

start();
