import { ActionIcon, AppShell, Container, Group, Modal, Paper, Stack, Title, Tooltip, Tabs } from '@mantine/core';
import { useGetAllAttendee } from './hooks/useGetAllAttendee';
import { MyTable } from './components/myTable/EviusTable';
import { IconSettings } from '@tabler/icons-react';
import { useDoor } from './hooks/useDoor';
import { ActiveAttendee } from './components/activeUser/ActiveAttendee';
import { Attendee } from './types/atendee.type';
import { CheckInUser } from './components/checkInUser/CheckInUser';

function App() {
	const { attendees, isLoading } = useGetAllAttendee();
	const { closeDoor, isOpenDoor, openDoor, selectedItem, setSelectedItem } = useDoor<Attendee>();

	const onAdministrateUser = (attendee: Attendee) => {
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
								<Modal opened={isOpenDoor} onClose={closeDoor}>
									{isOpenDoor && <ActiveAttendee selectedItem={selectedItem} />}
								</Modal>
								<Stack>
									<Title>Listado de usuario</Title>
									<MyTable
										isLoading={isLoading}
										withPagination
										elements={attendees}
										columns={[
											{
												accessor: 'properties.names',
												header: 'Nombre',
											},
											{
												accessor: 'properties.email',
												header: 'Correo',
											},
											{
												header: 'Acciones',
												render({ value, record }) {
													return (
														<Group>
															<Tooltip label='Administrar'>
																<ActionIcon
																	variant='light'
																	onClick={() => {
																		onAdministrateUser(record);
																	}}
																>
																	<IconSettings />
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
