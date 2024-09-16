import { Button, Center, Group, Paper, Select, Stack, TextInput } from '@mantine/core';
import { useCheckInUser } from '../../hooks/useCheckInUser';

export const CheckInUser = () => {
	const { userCode, experienceSelected, allExperience, isSaving, errorMessage, handleChangeExperienceSelected, validateUserCode, handledChangeUserCode } = useCheckInUser();

	return (
		<Paper shadow='xl' p='xl'>
			<Center>
				<Stack px='md'>
					<Group>
						<TextInput
							name='userCode'
							label='Código de usuario'
							placeholder='Ingrese el código'
							miw={400}
							value={userCode}
							onChange={({ target: { value } }) => handledChangeUserCode(value)}
							error={errorMessage}
						/>
						<Select value={experienceSelected} miw={400} label='Experiencia' data={allExperience} searchable onChange={(value) => handleChangeExperienceSelected(value ?? '')} />
					</Group>
					<TextInput type='number' label='Puntos' maw={200} placeholder='Por defecto es 0' />
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
