export type SaveParticipationOfUser = Omit<Participation, 'id' | 'experienceId' | 'experienceName' | 'email' | 'names' | 'checkInAt'> & { checkInAt?: string };

export type Participation = {
	id: string;
	experienceId: string;
	experienceName: string;
	userCode: string;
	points?: number;
	checkInAt: string;
	email: string;
	names: string;
};
