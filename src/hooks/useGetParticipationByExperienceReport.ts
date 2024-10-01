import { useEffect, useState } from 'react';
import { checkInService } from '../services/checkin.service';
import { Participation } from '../types/checkIn.type';
import { MyTableColumn } from '../components/myTable/EviusTable';

interface ParticipationByExperienceReport {
	experienceId: string;
	experienceName: string;
	totalUsers: number;
	totalPoints: number;
	timesPlayed: number;
	averagePoints: number;
	maxPoints: number;
	minPoints: number;
}

export const reportColumns: MyTableColumn<ParticipationByExperienceReport>[] = [
	{
		accessor: 'experienceName',
		header: 'Nombre de Experiencia',
	},
	{
		accessor: 'totalUsers',
		header: 'Usuarios Totales',
	},
	{
		accessor: 'totalPoints',
		header: 'Puntos Totales',
	},
	{
		accessor: 'timesPlayed',
		header: 'Veces Jugadas',
	},
	{
		accessor: 'averagePoints',
		header: 'Puntuación Promedio',
	},
	{
		accessor: 'maxPoints',
		header: 'Puntuación Máxima',
	},
	{
		accessor: 'minPoints',
		header: 'Puntuación Mínima',
	},
];

export const useGetParticipationByExperienceReport = () => {
	const [participationByExperience, setParticipationByExperience] = useState<ParticipationByExperienceReport[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchDaa = async () => {
		try {
			setIsLoading(true);
			const data = await checkInService.getUsersParticipation();

			const report = generateParticipationReport(data);
			setParticipationByExperience(report);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
		}
	};

	const generateParticipationReport = (userExperienceData: Participation[]): ParticipationByExperienceReport[] => {
		const report: { [key: string]: ParticipationByExperienceReport } = {};

		// Inicializar el reporte para cada experiencia
		checkInService.getAllExperience().forEach((experience) => {
			report[experience.id] = {
				experienceId: experience.id,
				experienceName: experience.name,
				totalUsers: 0,
				totalPoints: 0,
				timesPlayed: 0,
				averagePoints: 0,
				maxPoints: -Infinity,
				minPoints: Infinity,
			};
		});

		// Diccionario para hacer seguimiento de usuarios únicos por experiencia
		const userTracker: { [key: string]: Set<string> } = {};
		// Procesar los datos de los usuarios y actualizar el reporte
		userExperienceData.forEach((data) => {
			const experienceReport = report[data.experienceId];

			if (!userTracker[data.experienceId]) {
				userTracker[data.experienceId] = new Set();
			}

			// Verificar si el usuario ya ha sido contado para esta experiencia
			if (!userTracker[data.experienceId].has(data.userCode)) {
				experienceReport.totalUsers += 1;
				userTracker[data.experienceId].add(data.userCode);
			}

			// Actualizar puntos y número de veces jugadas
			experienceReport.totalPoints += data.points;
			experienceReport.timesPlayed += data.participationDateList.length;

			// Actualizar puntuaciones máximas y mínimas
			experienceReport.maxPoints = Math.max(experienceReport.maxPoints, data.points);
			experienceReport.minPoints = Math.min(experienceReport.minPoints, data.points);
		});

		// Calcular el puntaje promedio para cada experiencia
		Object.keys(report).forEach((experienceId) => {
			const experienceReport = report[experienceId];
			if (experienceReport.totalUsers > 0) {
				experienceReport.averagePoints = Number((experienceReport.totalPoints / experienceReport.totalUsers).toFixed(2));
			} else {
				experienceReport.averagePoints = 0;
				experienceReport.maxPoints = 0;
				experienceReport.minPoints = 0;
			}
		});

		// Convertir el reporte en un array para retornarlo
		return Object.values(report);
	};

	useEffect(() => {
		fetchDaa();
	}, []);

	return { participationByExperience, isLoading, reportColumns };
};
