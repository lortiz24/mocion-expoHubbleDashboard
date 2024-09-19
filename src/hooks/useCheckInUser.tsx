import { useState, useMemo } from 'react';
import { showConfirmModal } from '../helpers/confirmFeedbackManagment';
import { ConfirmModalType } from '../types/confirmModal';
import { Paper, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { checkInService } from '../services/checkin.service';

export const useCheckInUser = () => {
	const [isSaving, setIsSaving] = useState(false);
	const [experienceSelected, setExperienceSelected] = useState(checkInService.getExperienceId());

	const checkInForm = useForm<{ userCode: string; points: number }>({
		initialValues: {
			points: 0,
			userCode: '',
		},
		validate: {
			userCode(value) {
				if (value.length !== 6) return 'La longitud del código es de 6 caracteres';
			},
		},
	});

	const resetForm = () => {
		checkInForm.reset();
	};
	const handleError = (message: string) => {
		checkInForm.setFieldError('userCode', message);
		setIsSaving(false);
	};

	const handleChangeExperienceSelected = (experienceId: string) => {
		setExperienceSelected(experienceId);
		checkInService.setExperienceId(experienceId);
	};
	const onSaveCheckIn = async (userCode: string, points?: number) => {
		try {
			await checkInService.saveUserParticipation({ userCode, points });
			setIsSaving(false);
			resetForm();
		} catch (error) {
			const myError = error as Error;
			if (myError.message === '404') return handleError('El usuario no está registrado');
			handleError('Error al registrar la participación');
		}
	};

	const onSubmit = checkInForm.onSubmit(async ({ points, userCode }) => {
		setIsSaving(true);
		try {
			const attendee = await checkInService.getAttendeeByUserCode({ userCode });
			if (!attendee) return handleError('El usuario no está registrado');

			const previewParticipation = await checkInService.getUserParticipation({ userCode });

			const participationMessage = previewParticipation
				? 'El usuario ya participo en esta experiencia'
				: 'Presione continuar para guardar la participación de este usuario en la experiencia';

			const names = attendee.properties.names;
			const email = attendee.properties.email;

			showConfirmModal({
				type: ConfirmModalType.confirm,
				title: previewParticipation ? 'Este usuario ya participo' : 'Bienvenido!',
				description: (
					<Stack>
						<Text>{participationMessage}</Text>
						<Paper withBorder p={'md'} radius={'md'} bg={'gray.0'}>
							<Stack gap={0}>
								<Text fw={500}>{names}</Text>
								<Text c={'gray'}>{email}</Text>
							</Stack>
						</Paper>
					</Stack>
				),
				onConfirm: () => onSaveCheckIn(userCode, points === 0 ? undefined : points),
				onCancel: () => {
					setIsSaving(false);
				},
			});
		} catch (error) {
			handleError('Error al validar el código de usuario');
		}
	});

	const allExperience = useMemo(() => checkInService.getAllExperience().map((experience) => ({ label: experience.name, value: experience.id })), []);

	return {
		experienceSelected,
		allExperience,
		isSaving,
		handleChangeExperienceSelected,
		checkInForm,
		onSubmit,
	};
};
