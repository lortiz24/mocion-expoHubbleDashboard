import { Timestamp } from 'firebase/firestore';

export type SaveParticipationOfUser = Pick<Participation, 'userCode' | 'points'>;

export type Participation = {
	id: string;
	experienceId: string;
	experienceName: string;
	userCode: string;
	points: number;
	checkInAt: Timestamp;
	email: string;
	names: string;
	updateAt: Timestamp;
};
