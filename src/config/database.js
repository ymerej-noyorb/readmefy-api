import mysql from "mysql2/promise";

export const config = {
	database: {
		host: "readmefy-database",
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
		database: process.env.MYSQL_DATABASE,
		connectTimeout: 60000,
	},
	listPerPage: 10,
};

export const databaseIsHealthy = async () => {
	let connection;
	try {
		connection = await mysql.createConnection(config.database);
		await connection.ping();
	} catch (err) {
		throw err;
	} finally {
		if (connection) await connection.end();
	}
};

export const createTables = async () => {
	let connection;
	try {
		connection = await mysql.createConnection(config.database);

		const createUsersTableQuery = `
			CREATE TABLE IF NOT EXISTS users (
				readmefy_id INT AUTO_INCREMENT PRIMARY KEY,
				readmefy_created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
				readmefy_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
				provider_name VARCHAR(255) NOT NULL,
				provider_data JSON NOT NULL,
				provider_id VARCHAR(255) NOT NULL UNIQUE,
				provider_username VARCHAR(255) NOT NULL,
				provider_email VARCHAR(255),
				provider_avatar TEXT,
				INDEX(provider_id)
			);
		`;

		await connection.query(createUsersTableQuery);
	} catch (err) {
		throw err;
	} finally {
		if (connection) await connection.end();
	}
};
