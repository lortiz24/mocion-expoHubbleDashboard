import { Stack, Text } from '@mantine/core';
import { iconSizes } from '../../constants/styleProps';
import { IconNotesOff } from '@tabler/icons-react';

type Props = {
	message?: string;
};
export const ListEmpty = (props: Props) => {
	const { message } = props;
	return (
		<Stack justify='center' align='center' gap={'md'} h={'100%'}>
			<IconNotesOff style={{ color: 'gray' }} size={iconSizes.xLarge} />
			<Text c='dimmed'>{message ? message : 'No hay datos para mostrar'}</Text>
		</Stack>
	);
};
