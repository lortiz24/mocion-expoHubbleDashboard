import { Stack } from '@mantine/core';
import { useGetActivityReportByHourDay } from '../../hooks/useGetActivityReportByHourDay';
import { MyTable } from '../myTable/EviusTable';
import { ExportExcel } from '../exportExcel/ExportExcel';

export const ActividadPorHora = () => {
	const { activityReport, activityReportColumns, isLoading } = useGetActivityReportByHourDay();

	return (
		<Stack>
			<ExportExcel
				fileName='actividadPorHora'
				columns={activityReportColumns.map((colum) => ({ title: colum.header as string, dataIndex: colum.accessor as string }))}
				onlyColumns
				list={activityReport}
			/>
			<MyTable columns={activityReportColumns} elements={activityReport} isLoading={isLoading} />
		</Stack>
	);
};
