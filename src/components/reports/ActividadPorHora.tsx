import { useGetActivityReportByHourDay } from '../../hooks/useGetActivityReportByHourDay';
import { MyTable } from '../myTable/EviusTable';

export const ActividadPorHora = () => {
	const { activityReport, activityReportColumns, isLoading } = useGetActivityReportByHourDay();

	const epa = activityReport?.map((algo) => algo.totalPoints).reduce((a, b) => a + b);
	// console.log('epa', epa);

	return (
		<div>
			<MyTable columns={activityReportColumns} elements={activityReport} isLoading={isLoading} />
		</div>
	);
};
