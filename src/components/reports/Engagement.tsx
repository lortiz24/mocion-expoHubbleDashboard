import { Stack } from '@mantine/core';
import { useGetUserEngagementReport } from '../../hooks/useGetUserEngagementReport';
import { MyTable } from '../myTable/EviusTable';
import { ExportExcel } from '../exportExcel/ExportExcel';

export const Engagement = () => {
	const { engagementReportColumns, isLoading, userEngagementReport } = useGetUserEngagementReport();

	return (
		<Stack>
			<ExportExcel
				fileName='reportePorUsuario'
				columns={engagementReportColumns.map((colum) => ({ title: colum.header as string, dataIndex: colum.accessor as string }))}
				onlyColumns
				list={userEngagementReport}
			/>
			<MyTable columns={engagementReportColumns} elements={userEngagementReport} isLoading={isLoading} />
		</Stack>
	);
};
