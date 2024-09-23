import { Button, Center, Group, Paper, Select, Stack, TextInput } from '@mantine/core';
import { useCheckInUser } from '../../hooks/useCheckInUser';

export const CheckInUser = () => {
	const { experienceSelected, allExperience, isSaving, handleChangeExperienceSelected, onSubmit, checkInForm } = useCheckInUser();

	return (
		<Paper shadow='xl' p='xl'>
			<Center>
				<form onSubmit={onSubmit}>
					<Stack px='md'>
						<Group>
							<TextInput
								name='userCode'
								label='Código de usuario'
								placeholder='Ingrese el código'
								miw={400}
								value={checkInForm.values.userCode}
								onChange={({ target: { value } }) => {
									checkInForm.setFieldValue('userCode', value);
								}}
								error={checkInForm.errors.userCode}
							/>
							<Select
								clearable={false}
								value={experienceSelected}
								miw={400}
								label='Experiencia'
								data={allExperience}
								searchable
								onChange={(value) => handleChangeExperienceSelected(value ?? '')}
							/>
						</Group>
						<TextInput
							value={checkInForm.values.points}
							min={0}
							type='number'
							label='Puntos'
							maw={200}
							placeholder='Por defecto es 0'
							onChange={({ target: { value } }) => {
								checkInForm.setFieldValue('points', Number(value));
							}}
						/>
						<Group justify='end'>
							<Button type='submit' loading={isSaving} disabled={isSaving || Object.keys(checkInForm.errors).length > 0}>
								Enviar
							</Button>
						</Group>
					</Stack>
				</form>
			</Center>
		</Paper>
	);
};
