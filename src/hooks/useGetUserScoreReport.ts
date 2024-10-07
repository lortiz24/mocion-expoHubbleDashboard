import { useEffect, useState } from 'react';
import { checkInService } from '../services/checkin.service';
import { Participation } from '../types/checkIn.type';
import { MyTableColumn } from '../components/myTable/EviusTable';

interface UserScoreReport {
	userName: string;
	email: string;
	experienceName: string;
	firstParticipationPoints: number;
	timesParticipated: number;
}

export const userScoreColumns: MyTableColumn<UserScoreReport>[] = [
	{
		accessor: 'userName',
		header: 'Nombre de Usuario',
	},
	{
		accessor: 'email',
		header: 'Correo electrónico',
	},
	{
		accessor: 'experienceName',
		header: 'Nombre de Experiencia',
	},
	{
		accessor: 'firstParticipationPoints',
		header: 'Puntos',
	},
	{
		accessor: 'timesParticipated',
		header: 'Veces Participó',
	},
];

export const useGetUserScoreReport = () => {
	const [userScoreReport, setUserScoreReport] = useState<UserScoreReport[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const data = await checkInService.getUsersParticipation(); // Array de Participation

			const report = generateUserScoreReport(data);
			setUserScoreReport(report);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
		}
	};

	const generateUserScoreReport = (userExperienceData: Participation[]): UserScoreReport[] => {
		const report: UserScoreReport[] = [];

		// Diccionario para hacer seguimiento de la primera participación por usuario y experiencia
		const userExperienceTracker: { [key: string]: { [key: string]: { firstParticipationPoints: number; timesParticipated: number } } } = {};

		// Procesar los datos de los usuarios
		userExperienceData.forEach((data) => {
			const experienceId = data.experienceId;
			const userCode = data.userCode;

			// Inicializar el tracker para el usuario si no existe
			if (!userExperienceTracker[userCode]) {
				userExperienceTracker[userCode] = {};
			}

			// Si es la primera vez que se procesa la experiencia para este usuario, registrar los datos
			if (!userExperienceTracker[userCode][experienceId]) {
				userExperienceTracker[userCode][experienceId] = {
					firstParticipationPoints: data.points, // Puntos de la primera participación
					timesParticipated: data.participationDateList.length, // Primera participación
				};
			} else {
				// Si ya participó antes, solo aumentamos el número de participaciones
				userExperienceTracker[userCode][experienceId].timesParticipated += 1;
			}
		});

		// Crear el reporte final con base en los datos procesados
		Object.keys(userExperienceTracker).forEach((userCode) => {
			Object.keys(userExperienceTracker[userCode]).forEach((experienceId) => {
				const { firstParticipationPoints, timesParticipated } = userExperienceTracker[userCode][experienceId];
				const experience = checkInService.getExperienceById({ experienceId }); // Obtenemos el nombre de la experiencia
				const userParticipation = userExperienceData.find((d) => d.userCode === userCode && d.experienceId === experienceId);

				if (userParticipation) {
					report.push({
						userName: userParticipation.names, // Usar `names` como el nombre real del usuario
						email: userParticipation.email, // Usar `names` como el nombre real del usuario
						experienceName: experience.name,
						firstParticipationPoints,
						timesParticipated,
					});
				}
			});
		});

		return report;
	};

	useEffect(() => {
		fetchData();
	}, []);

	return { userScoreReport, isLoading, userScoreColumns };
};
