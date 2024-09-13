import { Button, Center, Group, Paper, Stack, Text, TextInput } from '@mantine/core';
import { useState } from 'react';
import { showConfirmModal } from '../../helpers/confirmFeedbackManagment';
import { ConfirmModalType } from '../../types/confirmModal';
import { checkInService } from '../../services/checkin.service';
/* import { CheckInServiceTs } from '../../export/firebaseService'; */

export const CheckInUser = () => {
	const [userCode, setUserCode] = useState('');
	const [isSaving, setIsSaving] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const handleError = (message: string) => {
		setErrorMessage(message);
		setIsSaving(false);
	};

	const validateUserCodeFormat = () => {
		if (userCode.length !== 6) {
			handleError('La longitud del código es de 6 caracteres');
			return false;
		}
		return true;
	};

	const validateUserCode = async () => {
		if (!validateUserCodeFormat()) return;

		setIsSaving(true);
		try {
			const attendee = await checkInService.getAttendeeByUserCode({ userCode });
			if (!attendee) return handleError('El usuario no está registrado');

			const previewParticipation = await checkInService.getUserParticipation({ userCode });

			const participationMessage = previewParticipation ? 'Confirmar otra participación' : 'Desea confirmar participación del usuario';

			const names = attendee.properties.names;
			const email = attendee.properties.email;

			showConfirmModal({
				type: ConfirmModalType.confirm,
				title: previewParticipation ? 'Participación múltiple' : 'Primera participación',
				description: (
					<Stack align='center'>
						<Text>
							{participationMessage}{' '}
							<Text component='span' fw={500}>
								{names}
							</Text>{' '}
							con el correo{' '}
							<Text component='span' fw={500}>
								{email}.
							</Text>
						</Text>
					</Stack>
				),
				onConfirm: () => onSaveCheckIn(),
				onCancel: () => setIsSaving(false),
			});
		} catch (error) {
			handleError('Error al validar el código de usuario');
		}
	};

	const onSaveCheckIn = async () => {
		try {
			await checkInService.saveUserParticipation({
				userCode,
			});
			setIsSaving(false);
		} catch (error) {
			const myError = error as Error;
			if (myError.message === '404') return handleError('El usuario no esta registrado');
			handleError('Error al registrar la participación');
		}
	};

	return (
		<Paper shadow='xl' p='xl'>
			<Center>
				<Stack px='md'>
					<TextInput
						name='userCode'
						label='Código de usuario'
						placeholder='Ingrese el código'
						miw={400}
						value={userCode}
						onChange={({ target: { value } }) => {
							setUserCode(value);
							if (errorMessage) setErrorMessage(''); // Limpia el error al cambiar el input
						}}
						error={errorMessage}
					/>
					<Group justify='end'>
						<Button onClick={validateUserCode} loading={isSaving} disabled={isSaving || !!errorMessage}>
							Enviar
						</Button>
					</Group>
				</Stack>
			</Center>
		</Paper>
	);
};
