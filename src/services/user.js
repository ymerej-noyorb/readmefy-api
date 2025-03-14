import { logger } from "../config/winston.js";
import { query } from "./database.js";
import { emptyOrRows, firstOrNull, getOffset } from "../utils/helper.js";
import { config } from "../config/database.js";

export const getUsers = async (page = 1) => {
	try {
		const offset = getOffset(page, config.listPerPage);
		const rows = await query(
			`select * from users limit ${offset}, ${config.listPerPage}`
		);
		const data = emptyOrRows(rows);
		const meta = { page };

		return {
			data,
			meta,
		};
	} catch (err) {
		logger.error("Error fetching users:", err);
		throw err;
	}
};

export const getUserByReadmefyId = async (readmefy_id) => {
	try {
		const rows = await query(
			`select provider_username, provider_avatar from users where readmefy_id = ?`,
			[readmefy_id]
		);
		return firstOrNull(rows);
	} catch (err) {
		logger.error(`Error fetching user by readmefy_id (${readmefy_id}):`, err);
		throw err;
	}
};

export const getUserByProviderId = async (provider_name, provider_id) => {
	try {
		const rows = await query(
			`select readmefy_id, provider_id, provider_data, provider_username, provider_email, provider_avatar from users where provider_name = ? and provider_id = ?`,
			[provider_name, provider_id]
		);
		return firstOrNull(rows);
	} catch (err) {
		logger.error(
			`Error fetching user by provider_name (${provider_name}) and provider_id (${provider_id}):`,
			err
		);
		throw err;
	}
};

export const insertUser = async (user) => {
	try {
		const result = await query(
			`insert into users (provider_name, provider_data, provider_id, provider_username, provider_email, provider_avatar) values (?, ?, ?, ?, ?, ?)`,
			[
				user.provider_name,
				user.provider_data,
				user.provider_id,
				user.provider_username,
				user.provider_email,
				user.provider_avatar,
			]
		);
		return { readmefy_id: result.insertId };
	} catch (err) {
		logger.error("Error inserting new user:", err);
		throw err;
	}
};

export const updateUser = async (user) => {
	try {
		await query(
			`update users set provider_data = ?, provider_username = ?, provider_email = ?, provider_avatar = ? where provider_name = ? and provider_id = ?`,
			[
				user.provider_data,
				user.provider_username,
				user.provider_email,
				user.provider_avatar,
				user.provider_name,
				user.provider_id,
			]
		);
	} catch (err) {
		logger.error("Error updating user:", err);
		throw err;
	}
};
