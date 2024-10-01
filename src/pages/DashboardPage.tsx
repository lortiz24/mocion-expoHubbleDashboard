import { Container, Tabs } from '@mantine/core';
import { UserList } from '../components/userList/UserList';
import { CheckInUser } from '../components/checkInUser/CheckInUser';
import { ReportView } from '../components/reports/ReportView';

export const DashboardPage = () => {
	return (
		<Container size={'xl'}>
			<Tabs defaultValue={'listOfUser'}>
				<Tabs.List>
					<Tabs.Tab value='listOfUser'>Lista de usuarios</Tabs.Tab>
					<Tabs.Tab value='checkIn'>Marcar Check In</Tabs.Tab>
					<Tabs.Tab value='report'>Reportes</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel value='listOfUser'>
					<UserList />
				</Tabs.Panel>
				<Tabs.Panel value='checkIn'>
					<CheckInUser />
				</Tabs.Panel>
				<Tabs.Panel value='report'>
					<ReportView />
				</Tabs.Panel>
			</Tabs>
		</Container>
	);
};
