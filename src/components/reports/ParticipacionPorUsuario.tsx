import { Stack } from '@mantine/core';
import { useGetUserScoreReport } from '../../hooks/useGetUserScoreReport';
import { MyTable } from '../myTable/EviusTable';
import { ExportExcel } from '../exportExcel/ExportExcel';

export const ParticipacionPorUsuario = () => {
	const { isLoading, userScoreColumns, userScoreReport } = useGetUserScoreReport();

	return (
		<Stack>
			<ExportExcel
				fileName='participacionUsuarioExperiencia'
				columns={userScoreColumns.map((colum) => ({ title: colum.header as string, dataIndex: colum.accessor as string }))}
				onlyColumns
				list={userScoreReport}
			/>
			<MyTable columns={userScoreColumns} elements={userScoreReport} isLoading={isLoading} />
		</Stack>
	);
};
