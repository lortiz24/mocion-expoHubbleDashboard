import { ActionIcon, Button, Group, Modal, Paper, Stack, TextInput, Title, Tooltip } from '@mantine/core';
import { MyTable } from '../myTable/EviusTable';
import { ActiveAttendee } from '../activeUser/ActiveAttendee';
import { IconEye, IconSearch } from '@tabler/icons-react';
import { useDoor } from '../../hooks/useDoor';
import { GroupedParticipation, useListeningParticipationByUser } from '../../hooks/useListeningParticipationByUser';
import { useSearchList } from '../../hooks/useSearchList';
import { useMyNavigation } from '../../hooks/useMyNavigation';

export const UserList = () => {
	const { closeDoor, isOpenDoor, openDoor, selectedItem, setSelectedItem } = useDoor<GroupedParticipation>();
	const { participationByUser } = useListeningParticipationByUser();
	const { filteredList, setSearchTerm } = useSearchList(participationByUser, ['email', 'names', 'userCode']);
	const { goToRanking } = useMyNavigation();

	const onAdministrateUser = (attendee: GroupedParticipation) => {
		openDoor();
		setSelectedItem(attendee);
	};

	return (
		<Paper shadow='xl' p={'xl'} style={{ rowGap: '20px' }}>
			<Modal opened={isOpenDoor} onClose={closeDoor} size={'xl'}>
				{isOpenDoor && selectedItem && <ActiveAttendee selectedItem={selectedItem} />}
			</Modal>
			<Stack>
				<Title>Listado de usuario</Title>
				<Group justify='space-between'>
					<TextInput label='Buscar usuario' placeholder='Parámetro de búsqueda' rightSection={<IconSearch />} onChange={({ target: { value } }) => setSearchTerm(value)} />
					<Button variant='outline' onClick={goToRanking}>
						Ranking
					</Button>
				</Group>
				<MyTable
					scrollContainerProps={{ minWidth: 400 }}
					withPagination
					elements={filteredList}
					columns={[
						{
							accessor: 'names',
							header: 'Nombre',
						},
						{
							accessor: 'email',
							header: 'Correo',
						},
						{
							accessor: 'userCode',
							header: 'Código',
						},
						{
							header: 'Acciones',
							render({ record }) {
								return (
									<Group>
										<Tooltip label='Ver detalles'>
											<ActionIcon
												variant='light'
												onClick={() => {
													onAdministrateUser(record);
												}}
											>
												<IconEye />
											</ActionIcon>
										</Tooltip>
									</Group>
								);
							},
						},
					]}
				/>
			</Stack>
		</Paper>
	);
};
