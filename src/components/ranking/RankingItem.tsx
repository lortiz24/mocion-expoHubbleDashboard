import { Avatar, Badge, Group, Paper, Stack, Text } from '@mantine/core';
import { TRankingItem } from '../../types/ranking.type';

type Props = {
	rankingItem: TRankingItem;
	position: number;
};

export const RankingItem = (props: Props) => {
	const { rankingItem, position } = props;

	const getColorAvatar = () => {
		switch (position) {
			case 1:
				return '#fbbf24';
			case 2:
				return '#64749a';
			case 3:
				return '#9a3412';

			default:
				return 'gray';
		}
	};
	return (
		<Paper shadow='lg' p={'lg'}>
			<Group wrap='nowrap' justify='space-between'>
				<Group>
					<Avatar color={getColorAvatar()} name={position + ''} size={'lg'} />
					<Stack gap={0}>
						<Text fw={500} fz={'lg'}>
							{rankingItem.names}
						</Text>
						<Text c={'gray'}>{rankingItem.email}</Text>
					</Stack>
				</Group>
				<Stack>
					<Badge size='xl' variant='light'>
						{rankingItem.points} Pts
					</Badge>
				</Stack>
			</Group>
		</Paper>
	);
};
