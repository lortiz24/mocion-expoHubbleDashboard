import { Stack } from '@mantine/core';
import { RankingItem } from './RankingItem';
import { useListeningRanking } from '../../hooks/useListeningRanking';

export const RankingList = () => {
	const { rankingList } = useListeningRanking();

	return (
		<Stack>
			{rankingList.map((rankingItem, index) => (
				<RankingItem rankingItem={rankingItem} position={index + 1} key={rankingItem.email} />
			))}
		</Stack>
	);
};
