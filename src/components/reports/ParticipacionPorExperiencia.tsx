import { useGetParticipationByExperienceReport } from '../../hooks/useGetParticipationByExperienceReport';
import { MyTable } from '../myTable/EviusTable';

export const ParticipacionPorExperiencia = () => {
	const { isLoading, participationByExperience, reportColumns } = useGetParticipationByExperienceReport();
	return (
		<div>
			<MyTable  columns={reportColumns} elements={participationByExperience} isLoading={isLoading}/>
		</div>
	);
};
