import { modals } from '@mantine/modals';
import { Stack, Text, Title } from '@mantine/core';
import { ConfirmModalType, EviusConfirmModalParams } from '../types/confirmModal';

export const showConfirmModal = (params: EviusConfirmModalParams) => {
	modals.openConfirmModal({
		children: (
			<Stack mih={200} align='center' justify='center' gap='md' maw={600}>
				<Title size='h2' order={4} ta={'center'}>
					{params.title}
				</Title>
				{typeof params.description == 'string' ? (
					<Text c={'gray'} ta={'center'}>
						{params.description}
					</Text>
				) : (
					<>{params.description}</>
				)}
			</Stack>
		),
		confirmProps: { color: params.type === ConfirmModalType.delete ? 'red' : undefined },
		labels: { confirm: 'Continuar', cancel: 'Cancelar' },
		onCancel: () => {
			if (params.onCancel) params.onCancel();
		},
		onClose() {
			if (params.onCancel) params.onCancel();
		},
		withCloseButton: false,
		onConfirm: () => {
			if (params.onConfirm) params.onConfirm();
		},
	});
};
