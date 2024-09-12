import { Paper } from '@mantine/core';
import { useGetAllExperiencesByEvent } from '../../hooks/useGetAllExperiencesByEvent';
import { MyTable } from '../myTable/EviusTable';
import { Attendee } from '../../types/atendee.type';

type Props = {
	selectedItem: Attendee | undefined;
};
export const ActiveAttendee = (props: Props) => {
	const { selectedItem } = props;
	const { experiences, isLoading: isLoadingExperiences } = useGetAllExperiencesByEvent({ eventId: '659daf350aa568b224060b32' });
    console.log('experiences', experiences)
	return (
		<Paper shadow='xl' p={'xl'} style={{ rowGap: '20px' }}>
			<MyTable
				elements={experiences}
				columns={[
					{
						accessor: 'name',
						header: 'Nombre',
					},
				]}
			/>
		</Paper>
	);
};
