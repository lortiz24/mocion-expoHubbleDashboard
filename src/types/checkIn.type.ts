export type SaveParticipationOfUser = Omit<Participation, 'id' | 'experienceId' | 'experienceName' | 'email' | 'names'>;

export type Participation = {
	id: string;
	experienceId: string;
	experienceName: string;
	userCode: string;
	points?: number;
	checkIn?: boolean;
	email: string;
	names: string;
};
