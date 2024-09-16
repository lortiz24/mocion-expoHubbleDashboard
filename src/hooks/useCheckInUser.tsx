import { useState, useMemo } from 'react';
import { checkInService } from '../services/checkin.service';
import { showConfirmModal } from '../helpers/confirmFeedbackManagment';
import { ConfirmModalType } from '../types/confirmModal';
import { Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';

export const useCheckInUser = () => {
	const [userCode, setUserCode] = useState('');
	const [isSaving, setIsSaving] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [experienceSelected, setExperienceSelected] = useState(checkInService.getExperienceId());

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

	const handledChangeUserCode = (userCode: string) => {
		setUserCode(userCode);
		if (errorMessage) setErrorMessage('');
	};

	const handleChangeExperienceSelected = (experienceId: string) => {
		setExperienceSelected(experienceId);
		checkInService.setExperienceId(experienceId);
	};
	const onSaveCheckIn = async () => {
		try {
			await checkInService.saveUserParticipation({ userCode });
			setIsSaving(false);
		} catch (error) {
			const myError = error as Error;
			if (myError.message === '404') return handleError('El usuario no está registrado');
			handleError('Error al registrar la participación');
		}
	};

	const allExperience = useMemo(() => checkInService.getAllExperience().map((experience) => ({ label: experience.name, value: experience.id })), []);

	return {
		userCode,
		experienceSelected,
		allExperience,
		isSaving,
		errorMessage,
		validateUserCode,
		handledChangeUserCode,
		handleChangeExperienceSelected,
	};
};
