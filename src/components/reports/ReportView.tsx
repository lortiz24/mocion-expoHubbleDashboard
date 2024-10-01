import { Box, Group, Paper, Stack, Tabs, Text } from '@mantine/core';
import { ParticipacionPorExperiencia } from './ParticipacionPorExperiencia';
import { ParticipacionPorUsuario } from './ParticipacionPorUsuario';
import { Engagement } from './Engagement';
import { ActividadPorHora } from './ActividadPorHora';
import { checkInService } from '../../services/checkin.service';
import { useEffect, useState } from 'react';
import { Participation } from '../../types/checkIn.type';

export const ReportView = () => {
	const [verdaderos, setverdaderos] = useState(0);
	const algo = async () => {
		const data = await checkInService.getUsersParticipation();
		const report = data.map((algo) => algo.points).reduce((prev, current) => prev + current);
		setverdaderos(report);
	};

	useEffect(() => {
		algo();
	}, []);

	return (
		<Box mt={'lg'}>
			<Stack>
				<Paper mih={200} bg={'gray.0'} p={'xl'}>
					<Stack gap={0} align='center'>
						<Text fw={'bold'}>Verdaderos puntos totales</Text>
						<Text>{verdaderos}</Text>
					</Stack>
				</Paper>
				<Tabs defaultValue={'participacionPorExperiencia'}>
					<Tabs.List>
						<Tabs.Tab value='participacionPorExperiencia'>Participación por Experiencia</Tabs.Tab>
						<Tabs.Tab value='participaciionPorUsuario'> Puntuaciones por Usuario y retención de usuarios</Tabs.Tab>
						<Tabs.Tab value='engagement'>Engagement por Usuario</Tabs.Tab>
						<Tabs.Tab value='actividadPorHora'>Actividad por Hora</Tabs.Tab>
					</Tabs.List>
					<Tabs.Panel value='participacionPorExperiencia'>
						<ParticipacionPorExperiencia />
					</Tabs.Panel>
					<Tabs.Panel value='participaciionPorUsuario'>
						<ParticipacionPorUsuario />
					</Tabs.Panel>
					<Tabs.Panel value='engagement'>
						<Engagement />
					</Tabs.Panel>
					<Tabs.Panel value='actividadPorHora'>
						<ActividadPorHora />
					</Tabs.Panel>
				</Tabs>
			</Stack>
		</Box>
	);
};
