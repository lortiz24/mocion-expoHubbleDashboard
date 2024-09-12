import { Button, Center, Group, Paper, Stack, Text, TextInput } from '@mantine/core';
import { useState } from 'react';
import { checkInService } from '../../services/checkin.service';
import { EVENT_ID, EXPERIENCE_ID } from '../../constants/event.constant';
import { showConfirmModal } from '../../helpers/confirmFeedbackManagment';
import { ConfirmModalType } from '../../types/confirmModal';

export const CheckInUser = () => {
	const [userCode, setUserCode] = useState('');
	const [isSaving, setIsSaving] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const validateUserCode = async () => {
		setIsSaving(true);

		if (userCode.length !== 6) {
			setIsSaving(false);
			setErrorMessage('La longitud del código es de 6 caracteres');
			return false;
		}

		const attendee = await checkInService.getAttendeeByUserCode({ eventId: EVENT_ID, userCode });

		if (attendee === null) {
			setIsSaving(false);
			return setErrorMessage('El usuario no esta registrado');
		}
		const previewParticipation = await checkInService.getParticipation({ eventId: EVENT_ID, experienceId: EXPERIENCE_ID, userCode });
		console.log(previewParticipation?.points);

		showConfirmModal({
			type: ConfirmModalType.confirm,
			title: previewParticipation ? 'Participación multiple' : 'Primera participación',
			description: (
				<Stack align='center'>
					{!previewParticipation ? (
						<Text component='span'>
							Desea confirmar participación del usuario{' '}
							<Text component='span' fw={500}>
								{attendee.properties.names}
							</Text>{' '}
							con el correo{' '}
							<Text component='span' fw={500}>
								{attendee.properties.email}.
							</Text>
						</Text>
					) : (
						<Text component='span'>
							Confirmar otra participación de{' '}
							<Text component='span' fw={500}>
								{attendee.properties.names}
							</Text>{' '}
							con el correo{' '}
							<Text component='span' fw={500}>
								{attendee.properties.email}.
							</Text>
						</Text>
					)}
				</Stack>
			),
			onConfirm: () => onSaveCheckIn(attendee.properties.email, attendee.properties.names),
			onCancel() {
				setIsSaving(false);
			},
		});
	};

	const onSaveCheckIn = async (email: string, names: string, newPoints?: number) => {
		try {
			await checkInService.saveParticipationOfUser({
				eventId: EVENT_ID,
				experienceId: EXPERIENCE_ID,
				userCode,
				points: 15,
				email,
				names,
			});
			setIsSaving(false);
		} catch (error) {
			setIsSaving(false);
			setErrorMessage('El usuario no esta registrado');
		}
	};

	return (
		<Paper shadow='xl' p={'xl'}>
			<Center>
				<Stack px={'md'}>
					<TextInput
						name='userCode'
						label='Código de usuario'
						placeholder='Ingrese el código'
						miw={400}
						onChange={({ target: { value } }) => {
							setUserCode(value);
							if (errorMessage.length > 0) setErrorMessage('');
						}}
						error={errorMessage}
					/>
					<Group justify='end'>
						<Button onClick={validateUserCode} loading={isSaving} disabled={errorMessage.length > 0}>
							Enviar
						</Button>
					</Group>
				</Stack>
			</Center>
		</Paper>
	);
};
