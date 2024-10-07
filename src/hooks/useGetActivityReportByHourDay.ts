import { useEffect, useState } from 'react';
import { checkInService } from '../services/checkin.service';
import { Participation } from '../types/checkIn.type';
import { MyTableColumn } from '../components/myTable/EviusTable';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// Extender dayjs con soporte para UTC y Timezone
dayjs.extend(utc);
dayjs.extend(timezone);

interface ActivityReportByHourDay {
	date: string;
	hour: string;
	totalParticipations: number;
	totalPoints: number;
}

export const activityReportColumns: MyTableColumn<ActivityReportByHourDay>[] = [
	{
		accessor: 'date',
		header: 'Fecha',
	},
	{
		accessor: 'hour',
		header: 'Hora',
	},
	{
		accessor: 'totalParticipations',
		header: 'Participaciones Totales',
	},
	{
		accessor: 'totalPoints',
		header: 'Puntos Acumulados',
	},
];

export const useGetActivityReportByHourDay = () => {
	const [activityReport, setActivityReport] = useState<ActivityReportByHourDay[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const data = await checkInService.getUsersParticipation(); // Array de Participation

			const report = generateActivityReportByHourDay(data);
			setActivityReport(report);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
		}
	};

	const generateActivityReportByHourDay = (participations: Participation[]): ActivityReportByHourDay[] => {
		const report: { [key: string]: { [hour: string]: { totalParticipations: number; totalPoints: number } } } = {};

		// Procesar los datos de las participaciones
		participations.forEach((participation) => {
			// Convertir el timestamp al formato de la zona horaria de México
			const participationDate = dayjs.unix(participation.checkInAt.seconds).tz('America/Mexico_City');
			const date = participationDate.format('YYYY-MM-DD'); // Segmentación por día
			const hour = participationDate.format('HH:00'); // Segmentación por hora (intervalos de 1 hora)

			// Inicializar el reporte para la fecha si no existe
			if (!report[date]) {
				report[date] = {};
			}

			// Inicializar el reporte para la hora si no existe
			if (!report[date][hour]) {
				report[date][hour] = { totalParticipations: 0, totalPoints: 0 };
			}

			// Actualizar el número total de participaciones y puntos acumulados
			report[date][hour].totalParticipations += participation.participationDateList.length;
			report[date][hour].totalPoints += participation.points;
		});

		// Convertir el reporte en un array para retornarlo
		const activityReportArray: ActivityReportByHourDay[] = [];

		Object.keys(report).forEach((date) => {
			Object.keys(report[date]).forEach((hour) => {
				activityReportArray.push({
					date,
					hour,
					totalParticipations: report[date][hour].totalParticipations,
					totalPoints: report[date][hour].totalPoints,
				});
			});
		});

		// Ordenar el reporte por fecha y hora
		return activityReportArray.sort((a, b) => {
			const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
			if (dateComparison !== 0) {
				return dateComparison;
			}
			// Comparar las horas si las fechas son iguales
			return parseInt(a.hour, 10) - parseInt(b.hour, 10);
		});
	};

	useEffect(() => {
		fetchData();
	}, []);

	return { activityReport, isLoading, activityReportColumns };
};
