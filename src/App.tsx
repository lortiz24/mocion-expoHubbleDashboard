import { ActionIcon, AppShell, Container, Group, Modal, Paper, Stack, Title, Tooltip, Tabs, TextInput } from '@mantine/core';
import { MyTable } from './components/myTable/EviusTable';
import { IconEye, IconSearch } from '@tabler/icons-react';
import { useDoor } from './hooks/useDoor';
import { ActiveAttendee } from './components/activeUser/ActiveAttendee';
import { CheckInUser } from './components/checkInUser/CheckInUser';
import { GroupedParticipation, useListeningParticipationByUser } from './hooks/useListeningParticipationByUser';
import { useSearchList } from './hooks/useSearchList';

function App() {
	const { closeDoor, isOpenDoor, openDoor, selectedItem, setSelectedItem } = useDoor<GroupedParticipation>();
	const { participationByUser } = useListeningParticipationByUser();
	const { filteredList, setSearchTerm } = useSearchList(participationByUser, ['email', 'names', 'userCode']);

	const onAdministrateUser = (attendee: GroupedParticipation) => {
		openDoor();
		setSelectedItem(attendee);
	};
	return (
		<AppShell header={{ height: 60 }}>
			<AppShell.Main>
				<Container size={'xl'}>
					<Tabs defaultValue={'listOfUser'}>
						<Tabs.List>
							<Tabs.Tab value='listOfUser'>Lista de usuarios</Tabs.Tab>
							<Tabs.Tab value='checkIn'>Marcar Check In</Tabs.Tab>
						</Tabs.List>
						<Tabs.Panel value='listOfUser'>
							<Paper shadow='xl' p={'xl'} style={{ rowGap: '20px' }}>
								<Modal opened={isOpenDoor} onClose={closeDoor} size={'xl'}>
									{isOpenDoor && selectedItem && <ActiveAttendee selectedItem={selectedItem} />}
								</Modal>
								<Stack>
									<Title>Listado de usuario</Title>
									<Group>
										<TextInput
											label='Buscar usuario'
											placeholder='Parámetro de búsqueda'
											rightSection={<IconSearch />}
											onChange={({ target: { value } }) => setSearchTerm(value)}
										/>
									</Group>
									<MyTable
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
						</Tabs.Panel>
						<Tabs.Panel value='checkIn'>
							<CheckInUser />
						</Tabs.Panel>
					</Tabs>
				</Container>
			</AppShell.Main>
		</AppShell>
	);
}

export default App;
