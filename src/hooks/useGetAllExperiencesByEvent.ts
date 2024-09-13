import { useEffect, useState } from 'react';
import { checkInService } from '../services/checkin.service';
import { Experience } from '../types/experience.type';

export const useGetAllExperiencesByEvent = () => {
	const [experiences, setExperiences] = useState<Experience[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchAllExperiences = async () => {
		setIsLoading(true);
		const experiences = await checkInService.getAllExperience();
		setExperiences(experiences);
		setIsLoading(false);
	};

	useEffect(() => {
		fetchAllExperiences();
	}, []);

	return { experiences, isLoading };
};
