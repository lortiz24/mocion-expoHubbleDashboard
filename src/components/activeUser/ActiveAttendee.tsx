import { Paper } from '@mantine/core';
import { MyTable } from '../myTable/EviusTable';
import { GroupedParticipation } from '../../hooks/useListeningParticipationByUser';
import { checkInService } from '../../services/checkin.service';

type Props = {
	selectedItem: GroupedParticipation;
};
export const ActiveAttendee = (props: Props) => {
	const { selectedItem } = props;

	const tablaDeExperiencias = checkInService.getAllExperience().map((experiencia) => {
		const participationIntoExperience = selectedItem.participations.find((participation) => participation.experienceId === experiencia.id);
		return {
			experiencia: experiencia.name,
			checkIn: !!participationIntoExperience,
			checkInAt: participationIntoExperience?.checkInAt,
			points: participationIntoExperience?.points,
		};
	});

	const reOrderElements = tablaDeExperiencias.sort((a, b) => {
		return a.checkIn === b.checkIn ? 0 : a.checkIn ? -1 : 1;
	});

	return (
		<Paper shadow='xl' p={'xl'} style={{ rowGap: '20px' }}>
			<MyTable
				elements={reOrderElements}
				columns={[
					{
						accessor: 'experiencia',
						header: 'Experiencia',
					},
					{
						accessor: 'checkIn',
						header: 'Participo',
						render({ value }) {
							return <>{value ? 'Si' : 'No'}</>;
						},
					},
					{
						accessor: 'checkInAt',
						header: 'Fecha participación',
						render({ record }) {
							const date = record.checkInAt?.toDate();
							return <>{date?.toLocaleString()}</>;
						},
					},
					{
						accessor: 'points',
						header: 'Puntos',
					},
				]}
			/>
		</Paper>
	);
};
