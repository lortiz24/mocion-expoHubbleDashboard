import { useEffect, useState } from 'react';
import { checkInService } from '../services/checkin.service';
import { Attendee } from '../types/atendee.type';

export const useGetAllAttendee = () => {
	const [attendees, setAttendees] = useState<Attendee[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchAllAttendees = async () => {
		setIsLoading(true);
		const attendees = await checkInService.getAllAttendee();
		setAttendees(attendees);
		setIsLoading(false);
	};

	useEffect(() => {
		fetchAllAttendees();
	}, []);

	return { attendees, isLoading };
};
