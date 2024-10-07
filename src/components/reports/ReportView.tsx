import { Box, Tabs } from '@mantine/core';
import { ParticipacionPorExperiencia } from './ParticipacionPorExperiencia';
import { ParticipacionPorUsuario } from './ParticipacionPorUsuario';
import { Engagement } from './Engagement';
import { ActividadPorHora } from './ActividadPorHora';

export const ReportView = () => {
	return (
		<Box mt={'lg'}>
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
		</Box>
	);
};
