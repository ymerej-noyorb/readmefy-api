import mysql from "mysql2/promise";
import { config } from "../config/database.js";

export const query = async (sql, params) => {
	const connection = await mysql.createConnection(config.database);
	const [results] = await connection.execute(sql, params);
	await connection.end();
	return results;
};
