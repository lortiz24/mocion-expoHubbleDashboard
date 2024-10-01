import { useCallback, useEffect, useState } from 'react';
import { checkInService } from '../services/checkin.service';
import { Participation } from '../types/checkIn.type';
import { TRankingItem } from '../types/ranking.type';

export const useListeningRanking = () => {
	const [rankingList, setRankingList] = useState<TRankingItem[]>([]);

	const parseData = useCallback((participationList: Participation[]) => {
		const topFive = getTopRanking(participationList);
		console.log('participationList', participationList)
		setRankingList(topFive);
	}, []);

	const getTopRanking = (experiences: Participation[]): TRankingItem[] => {
		const pointsByUser: Record<string, Omit<TRankingItem, 'userCode'>> = {};

		experiences.forEach((exp) => {
			if (!pointsByUser[exp.userCode]) {
				pointsByUser[exp.userCode] = { points: 0, names: exp.names, email: exp.email };
			}
			pointsByUser[exp.userCode].points += exp.points ?? 0;
		});

		const ranking = Object.entries(pointsByUser)
			.map(([userCode, data]) => ({ userCode, ...data }))
			.sort((a, b) => b.points - a.points);

		return ranking.slice(0, 5);
	};

	useEffect(() => {
		const unSubscribe = checkInService.listeningUsersParticipation(parseData);
		return () => {
			unSubscribe();
		};
	}, [parseData]);

	return { rankingList };
};
