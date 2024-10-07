import { Stack } from '@mantine/core';
import { useGetParticipationByExperienceReport } from '../../hooks/useGetParticipationByExperienceReport';
import { MyTable } from '../myTable/EviusTable';
import { ExportExcel } from '../exportExcel/ExportExcel';

export const ParticipacionPorExperiencia = () => {
	const { isLoading, participationByExperience, reportColumns } = useGetParticipationByExperienceReport();
	return (
		<Stack>
			<ExportExcel
				fileName='reporteDeExperiencias'
				columns={reportColumns.map((colum) => ({ title: colum.header as string, dataIndex: colum.accessor as string }))}
				onlyColumns
				list={participationByExperience}
			/>
			<MyTable columns={reportColumns} elements={participationByExperience} isLoading={isLoading} />
		</Stack>
	);
};
