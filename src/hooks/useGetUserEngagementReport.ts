import { useEffect, useState } from 'react';
import { checkInService } from '../services/checkin.service';
import { Participation } from '../types/checkIn.type';
import { MyTableColumn } from '../components/myTable/EviusTable';

interface UserEngagementReport {
	ranking: number;
	userName: string;
	totalTimesPlayed: number;
	totalExperiencesParticipated: number;
	totalPoints: number;
}

export const engagementReportColumns: MyTableColumn<UserEngagementReport>[] = [
	{
		accessor: 'ranking',
		header: 'Ranking',
	},
	{
		accessor: 'userName',
		header: 'Nombre de Usuario',
	},
	{
		accessor: 'totalTimesPlayed',
		header: 'Total Veces Jugó',
	},
	{
		accessor: 'totalExperiencesParticipated',
		header: 'Total Experiencias',
	},
	{
		accessor: 'totalPoints',
		header: 'Puntos Totales',
	},
];

export const useGetUserEngagementReport = () => {
	const [userEngagementReport, setUserEngagementReport] = useState<UserEngagementReport[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const data = await checkInService.getUsersParticipation(); // Array de Participation

			const report = generateUserEngagementReport(data);
			setUserEngagementReport(report);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
		}
	};

	const generateUserEngagementReport = (userExperienceData: Participation[]): UserEngagementReport[] => {
		const report: { [key: string]: { userName: string; totalPoints: number; totalTimesPlayed: number; totalExperiencesParticipated: Set<string>; firstParticipationDate: Date } } = {};

		// Procesar los datos de los usuarios
		userExperienceData.forEach((data) => {
			const userCode = data.userCode;

			// Inicializar el reporte para el usuario si aún no existe
			if (!report[userCode]) {
				report[userCode] = {
					userName: data.names,
					totalPoints: 0,
					totalTimesPlayed: 0,
					totalExperiencesParticipated: new Set<string>(), // Usamos un Set para contar experiencias únicas
					firstParticipationDate: data.checkInAt.toDate(), // Fecha de la primera participación
				};
			}

			// Actualizar el número total de veces que jugó en cualquier experiencia
			report[userCode].totalTimesPlayed += data.participationDateList.length;

			// Sumar los puntos de todas sus participaciones
			report[userCode].totalPoints += data.points;

			// Añadir la experiencia a la lista de experiencias en las que participó
			report[userCode].totalExperiencesParticipated.add(data.experienceId);

			// Actualizar la primera fecha de participación si esta es más antigua
			if (data.checkInAt.toDate() < report[userCode].firstParticipationDate) {
				report[userCode].firstParticipationDate = data.checkInAt.toDate();
			}
		});

		// Convertir el reporte en un array y ordenar por puntos totales (de mayor a menor), desempatar por fecha de primera participación
		const sortedReport = Object.values(report).sort((a, b) => {
			if (b.totalPoints !== a.totalPoints) {
				return b.totalPoints - a.totalPoints; // Ordenar por puntos (descendente)
			}
			return a.firstParticipationDate.getTime() - b.firstParticipationDate.getTime(); // Desempatar por fecha de primera participación (ascendente)
		});

		// Asignar los rankings
		return sortedReport.map((entry, index) => ({
			ranking: index + 1,
			userName: entry.userName,
			totalTimesPlayed: entry.totalTimesPlayed,
			totalExperiencesParticipated: entry.totalExperiencesParticipated.size, // Convertimos el Set en su tamaño
			totalPoints: entry.totalPoints,
		}));
	};

	useEffect(() => {
		fetchData();
	}, []);

	return { userEngagementReport, isLoading, engagementReportColumns };
};
