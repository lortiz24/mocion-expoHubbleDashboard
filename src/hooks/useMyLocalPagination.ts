import { useState, useEffect, useMemo } from 'react';

const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 1;

export type MyLocalPagination = {
	currentPage: number;
	totalPages: number;
	totalElements: number;
	limit: number;
	onChangePage: (newPage: number) => void;
	onSetLimit: (newLimit: number) => void;
};

export const useMyLocalPagination = <T>(elements: T[], { limitParams }: { limitParams?: number } = {}) => {
	const [totalElements, setTotalElements] = useState(elements.length);
	const [limit, setLimit] = useState(limitParams || DEFAULT_LIMIT);
	const [currentPage, setCurrentPage] = useState(DEFAULT_OFFSET);

	const totalPages = Math.ceil(totalElements / limit);

	const onChangePage = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	const onSetLimit = (newLimit: number) => {
		setLimit(newLimit);
		setCurrentPage(1); // Reset to first page when limit changes
	};

	useEffect(() => {
		setTotalElements(elements.length);
		if (currentPage > totalPages) {
			setCurrentPage(totalPages > 0 ? totalPages : 1);
		}
	}, [elements, totalPages, currentPage]);

	const paginatedElements = useMemo(() => {
		const start = (currentPage - 1) * limit;
		const end = start + limit;
		return elements.slice(start, end);
	}, [elements, currentPage, limit]);

	return { paginatedElements, pagination: { currentPage, totalPages, totalElements, limit, onChangePage, onSetLimit } };
};
