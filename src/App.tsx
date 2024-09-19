import { AppShell } from '@mantine/core';
import { checkInService } from './services/checkin.service';
import { Route, Routes } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { RankingPage } from './pages/RankingPage';

function App() {
	console.log('Iniciando aplicación 😄');
	console.log('EventId', `event/${checkInService.eventId}/usersActivityIntoExperiences`);
	console.log('ExperienceId', checkInService.experienceId);

	return (
		<AppShell header={{ height: 60 }}>
			<AppShell.Main>
				<Routes>
					<Route path='/' element={<DashboardPage />} />
					<Route path='/ranking' element={<RankingPage />} />
				</Routes>
			</AppShell.Main>
		</AppShell>
	);
}

export default App;
