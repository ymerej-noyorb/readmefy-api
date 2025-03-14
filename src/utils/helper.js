export const getOffset = (currentPage = 1, listPerPage) => {
	return (currentPage - 1) * [listPerPage];
};

export const emptyOrRows = (rows) => {
	if (!rows) {
		return [];
	}
	return rows;
};

export const firstOrNull = (rows) => {
	const safeRows = emptyOrRows(rows);
	return safeRows.length > 0 ? safeRows[0] : null;
};
