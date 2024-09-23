import { Badge, Paper, Stack, Text } from '@mantine/core';
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
			cantParticipacions: participationIntoExperience?.participationDateList?.length ?? 0,
		};
	});

	const reOrderElements = tablaDeExperiencias.sort((a, b) => {
		return a.checkIn === b.checkIn ? 0 : a.checkIn ? -1 : 1;
	});

	return (
		<Paper shadow='xl' p={'xl'} style={{ rowGap: '20px' }}>
			<Stack>
				<Text>{selectedItem.names}</Text>
				<MyTable
					scrollContainerProps={{ minWidth: 400 }}
					elements={reOrderElements}
					columns={[
						{
							accessor: 'experiencia',
							header: 'Experiencia',
						},
						/* {
						accessor: 'checkIn',
						header: 'Participo',
						render({ value }) {
							return <>{value ? 'Si' : 'No'}</>;
						},
					}, */
						{
							accessor: 'checkInAt',
							header: 'Fecha participación',
							render({ record }) {
								const date = record.checkInAt?.toDate();
								if (!date) {
									return (
										<Badge variant='outline' color='gray'>
											No participo
										</Badge>
									);
								}
								return <>{date?.toLocaleString()}</>;
							},
						},
						{
							accessor: 'points',
							header: 'Puntos',
						},
						{
						accessor: 'points',
						header: 'Participo',
						render({ value, record }) {
							return <>{record.cantParticipacions > 0 ? record.cantParticipacions:null}</>;
						},
					},
					]}
				/>
			</Stack>
		</Paper>
	);
};
