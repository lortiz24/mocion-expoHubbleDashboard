import { AppShell, Container, Tabs } from '@mantine/core';
import { CheckInUser } from './components/checkInUser/CheckInUser';
import { UserList } from './components/userList/UserList';
import { checkInService } from './services/checkin.service';

function App() {
	console.log('Iniciando aplicación 😄');
	console.log('EventId', `event/${checkInService.eventId}/usersActivityIntoExperiences`);
	console.log('ExperienceId', checkInService.experienceId);
	
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
							<UserList />
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
