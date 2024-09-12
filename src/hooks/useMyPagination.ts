import { useState, useEffect } from 'react';

const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 1;

export type MyPagination = {
	currentPage: number;
	totalPages: number;
	totalElements: number;
	limit: number;
	offset: number;
	onChangePage: (newPage: number) => void;
	onSetTotalElements: (totalElements: number) => void;
	onSetLimit: (newLimit: number) => void;
};

export const useMyPagination = (totalElementsParams?: number): MyPagination => {
	const [totalElements, setTotalElements] = useState(totalElementsParams ?? 0);
	const [limit, setLimit] = useState(DEFAULT_LIMIT);
	const [currentPage, setCurrentPage] = useState(DEFAULT_OFFSET);

	const offset = (currentPage - 1) * limit;

	const totalPages = Math.ceil(totalElements / limit);

	const onChangePage = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	const onSetTotalElements = (total: number) => {
		setTotalElements(total);
	};

	const onSetLimit = (newLimit: number) => {
		setLimit(newLimit);
		setCurrentPage(1); // Reset to first page when limit changes
	};

	useEffect(() => {
		if (currentPage > totalPages) {
			setCurrentPage(totalPages > 0 ? totalPages : 1);
		}
	}, [totalPages, currentPage]);

	return {
		currentPage,
		totalPages,
		totalElements,
		limit,
		offset,
		onChangePage,
		onSetTotalElements,
		onSetLimit,
	};
};
