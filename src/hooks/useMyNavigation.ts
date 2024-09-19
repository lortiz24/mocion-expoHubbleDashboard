import { useNavigate } from 'react-router-dom';

export const useMyNavigation = () => {
	const navigate = useNavigate();

	const goToRanking = () => {
		navigate('/ranking');
	};

	return { goToRanking };
};
