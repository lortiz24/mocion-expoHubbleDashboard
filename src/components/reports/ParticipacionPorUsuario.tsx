import { useGetUserScoreReport } from '../../hooks/useGetUserScoreReport';
import { MyTable } from '../myTable/EviusTable';

export const ParticipacionPorUsuario = () => {
	const { isLoading, userScoreColumns, userScoreReport } = useGetUserScoreReport();

	return (
		<div>
			<MyTable columns={userScoreColumns} elements={userScoreReport} isLoading={isLoading} />
		</div>
	);
};
