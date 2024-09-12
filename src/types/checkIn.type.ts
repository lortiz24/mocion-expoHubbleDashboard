export type SaveParticipationOfUser = {
	eventId: string;
} & Omit<Participation, 'id'>;

export type Participation = {
	id: string;
	experienceId: string;
	userCode: string;
	points?: number;
	checkIn?: boolean;
	email: string;
	names: string;
};
