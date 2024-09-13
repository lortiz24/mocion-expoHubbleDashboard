import { useEffect, useState } from 'react';
import { Participation } from '../types/checkIn.type';
import { checkInService } from '../services/checkin.service';

export interface GroupedParticipation {
	userCode: string;
	email: string;
	names: string;
	participations: Participation[];
}

function groupByEmail(participations: Participation[]): GroupedParticipation[] {
	const groupedMap = new Map<string, GroupedParticipation>();

	participations.forEach((participation) => {
		const { email, names, userCode } = participation;

		if (!groupedMap.has(email)) {
			// Si no existe el email en el mapa, creamos un nuevo objeto GroupedParticipation
			groupedMap.set(email, {
				userCode,
				email,
				names,
				participations: [participation],
			});
		} else {
			// Si ya existe, agregamos la nueva participación al array de participations
			const existingGroup = groupedMap.get(email);
			if (existingGroup) {
				existingGroup.participations.push(participation);
			}
		}
	});

	// Convertimos el mapa a un array
	return Array.from(groupedMap.values());
}

export const useListeningParticipationByUser = () => {
	const [participationByUser, setParticipationByUser] = useState<GroupedParticipation[]>([]);

	const parseData = (participations: Participation[]) => {
		setParticipationByUser(groupByEmail(participations));
	};

	useEffect(() => {
		const unSubscribe = checkInService.listeningUsersParticipation(parseData);
		return () => {
			unSubscribe();
		};
	}, []);

	return { participationByUser };
};
