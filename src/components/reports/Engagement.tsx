import { useGetUserEngagementReport } from '../../hooks/useGetUserEngagementReport';
import { MyTable } from '../myTable/EviusTable';

export const Engagement = () => {
	const { engagementReportColumns, isLoading, userEngagementReport } = useGetUserEngagementReport();

	return (
		<div>
			<MyTable columns={engagementReportColumns} elements={userEngagementReport} isLoading={isLoading} />
		</div>
	);
};
