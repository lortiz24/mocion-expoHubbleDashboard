import { Pagination, PaginationRootProps } from '@mantine/core';
import { MyLocalPagination } from '../../hooks/useMyLocalPagination';
import { MyPagination } from '../../hooks/useMyPagination';

interface Props extends Partial<PaginationRootProps> {
	pagination: MyPagination | MyLocalPagination	;
}
export const MyPaginationControls = (props: Props) => {
	const { pagination, ...paginationProps } = props;
	return (
		<Pagination
			total={pagination.totalPages}
			value={pagination.currentPage}
			onChange={(currentPage) => {
				pagination.onChangePage(currentPage);
			}}
		/>
	);
};
