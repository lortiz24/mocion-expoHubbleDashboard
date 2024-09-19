import { Container, Title } from '@mantine/core';
import { RankingList } from '../components/ranking/RankingList';

export const RankingPage = () => {
	return (
		<Container size={'xl'}>
			<Title>Top 5 de participantes</Title>
			<RankingList />
		</Container>
	);
};
