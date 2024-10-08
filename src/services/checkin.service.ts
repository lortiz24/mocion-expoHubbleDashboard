import { addDoc, collection, CollectionReference, doc, DocumentData, Firestore, getDocs, onSnapshot, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { FirebaseDB } from '../config/firebase.config';
import { Participation, SaveParticipationOfUser } from '../types/checkIn.type';
import { Attendee } from '../types/atendee.type';
import { Experience } from '../types/experience.type';

export class CheckInService {
	readonly eventId: string = '66d9babfff8148182c053214'; //Todo: Aquí coloca el id del evento
	experienceId: string = 'i0own9qlUQ'; //toDo: Aquí coloca el id de la experiencia asignada
	participationCollection: CollectionReference<DocumentData, DocumentData>;
	attendeesCollection: CollectionReference<DocumentData, DocumentData>;
	experiences: Experience[] = [
		{
			id: 'i0own9qlUQ',
			name: 'EXPERIENCIA HUBBELL - HOLOGRAMA INTERACTIVO', //Carlos Guerra
		},
		{
			id: 'KbCLd9hZ3r',
			name: 'EXPERIENCIA BURNDY - RACO - WIEGMANN - JUEGO DE DESTREZA EN TÓTEM', //Alejandra
		},
		{
			id: 'cyhH5yUGs5',
			name: 'CHANCE LINEMAN TOOLS - MEMORY MATCH', //Carlos Guerra
		},
		{
			id: 'HI0qLLtutT',
			name: 'EXPERIENCIA KILLARK - TRIVIA EN TÓTEM', //Fabian Salcedo
		},
		{
			id: 'Fjkyw8lfUy',
			name: 'EXPERIENCIA BURNDY - REALIDAD VIRTUAL CON OCULUS',
		},
		{
			id: 'jZ8JxL0Vue',
			name: 'EXPERIENCIA WIRING - DETECCIÓN DE FALLAS VR',
		},
		{
			id: '45VD1hir8z',
			name: 'EXPERIENCIA RACO - JUEGO DE DESTREZA EN TÓTEM', //Fabian Salcedo
		},
	];

	constructor(private readonly firebaseDB: Firestore) {
		this.participationCollection = collection(this.firebaseDB, `event/${this.eventId}/usersActivityIntoExperiences`);
		this.attendeesCollection = collection(this.firebaseDB, `/${this.eventId}_event_attendees`);
	}

	setExperienceId(experienceId: string) {
		if (this.experiences.some((experience) => experience.id === experienceId)) this.experienceId = experienceId;
	}

	getExperienceId() {
		return this.experienceId;
	}

	async getUserParticipation({ userCode }: { userCode: string }) {
		const q = query(this.participationCollection, where('userCode', '==', userCode), where('experienceId', '==', this.experienceId));

		const querySnapshot = await getDocs(q);

		if (!querySnapshot.empty) {
			const participation: Participation = {
				id: querySnapshot.docs[0].id,
				...(querySnapshot.docs[0].data() as Omit<Participation, 'id'>),
			};
			return participation as Participation;
		} else {
			return null;
		}
	}

	async saveUserParticipation({ userCode, points, newParticipation = false }: SaveParticipationOfUser) {
		const attendee = await this.getAttendeeByUserCode({ userCode });
		const now = new Date();

		const checkInAt = Timestamp.fromDate(now);
		const updateAt = Timestamp.fromDate(now);

		if (attendee === null) throw Error('404');

		const previousParticipation = await this.getUserParticipation({ userCode });

		if (previousParticipation) {
			const docId = previousParticipation.id;
			const userExperienceRef = doc(this.firebaseDB, `event/${this.eventId}/usersActivityIntoExperiences`, docId);

			const newPoints = points === undefined ? previousParticipation.points : points;

			const newParticipationDateList: Timestamp[] = [...previousParticipation.participationDateList];
			if (newParticipation) {
				newParticipationDateList.push(checkInAt);
			}

			await updateDoc(userExperienceRef, { points: newPoints, updateAt, participationDateList: newParticipationDateList });

			return docId;
		} else {
			const experience = this.getExperienceById({ experienceId: this.experienceId });
			const attendee = await this.getAttendeeByUserCode({ userCode });

			if (!attendee) return console.error('El código no esta registrado');

			const newDoc: Omit<Participation, 'id'> = {
				participationDateList: [checkInAt],
				userCode,
				checkInAt,
				experienceId: this.experienceId,
				experienceName: experience.name,
				points: points === undefined ? 0 : points,
				email: attendee.properties.email,
				names: attendee.properties.names,
				updateAt,
			};
			const newDocRef = await addDoc(this.participationCollection, newDoc);
			return newDocRef.id;
		}
	}

	async getAttendeeByUserCode({ userCode }: { userCode: string }): Promise<Attendee | null> {
		const q = query(this.attendeesCollection, where('user_code', '==', userCode));

		const querySnapshot = await getDocs(q);

		if (!querySnapshot.empty) {
			if (querySnapshot.docs.length > 1) throw new Error('Código asignado a dos usuarios');

			const docId = querySnapshot.docs[0].id;
			const data = querySnapshot.docs[0].data() as Omit<Attendee, 'id'>;
			const attendee: Attendee = {
				id: docId,
				...data,
			};
			return attendee as Attendee;
		}
		return null;
	}
	// ---------------------------------------------------------------------------------------------------
	async getUsersParticipation(): Promise<Participation[]> {
		/* const q = query(this.participationCollection, where('experienceId', '==', 'jZ8JxL0Vue'));

		const querySnapshot = await getDocs(q);
		console.log('querySnapshot', querySnapshot); */
		const querySnapshot = await getDocs(this.participationCollection); // Obtener todos los documentos

		if (!querySnapshot.empty) {
			// Mapeamos todos los documentos a un array de objetos Participation
			const usersParticipation: Participation[] = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...(doc.data() as Omit<Participation, 'id'>),
			}));
			return this.removeDuplicateParticipations(usersParticipation);
		} else {
			return [] as Participation[];
		}
	}
	listeningUsersParticipation(onSetUsersParticipants: (data: Participation[]) => void) {
		return onSnapshot(
			this.participationCollection,
			(querySnapshot) => {
				if (!querySnapshot.empty) {
					// Mapeamos todos los documentos a un array de objetos Participation
					const usersParticipation: Participation[] = querySnapshot.docs.map((doc) => ({
						id: doc.id,
						...(doc.data() as Omit<Participation, 'id'>),
					}));

					onSetUsersParticipants(this.removeDuplicateParticipations(usersParticipation));
					// Aquí puedes manejar los datos actualizados, por ejemplo, guardarlos en el estado
				} else {
					onSetUsersParticipants([]);
					console.log('No hay participaciones');
				}
			},
			(error) => {
				console.error('Error al escuchar cambios en la participación:', error);
			}
		);
	}

	listeningParticipationByUser({ onSetUsersParticipants, userCode }: { userCode: string; onSetUsersParticipants: (data: Participation[]) => void }) {
		const filteredQuery = query(this.participationCollection, where('userCode', '==', userCode));

		return onSnapshot(
			filteredQuery,
			(querySnapshot) => {
				if (!querySnapshot.empty) {
					// Mapeamos todos los documentos a un array de objetos Participation
					const usersParticipation: Participation[] = querySnapshot.docs.map((doc) => ({
						id: doc.id,
						...(doc.data() as Omit<Participation, 'id'>),
					}));
					onSetUsersParticipants(usersParticipation);
					console.log('Participaciones actualizadas:', usersParticipation);
				} else {
					console.log('No hay participaciones');
					onSetUsersParticipants([]);
				}
			},
			(error) => {
				console.error('Error al escuchar cambios en la participación:', error);
			}
		);
	}

	async getAllAttendee() {
		const snapshot = await getDocs(this.attendeesCollection);
		const attendees: any[] = [];
		snapshot.forEach((doc) => {
			const attendee = {
				id: doc.id,
				...doc.data(),
			};
			attendees.push(attendee);
		});
		return attendees;
	}

	getAllExperience() {
		return this.experiences;
	}
	getExperienceById({ experienceId }: { experienceId: string }) {
		const experience = this.experiences.find((experience) => experience.id === experienceId) as Experience;
		return experience;
	}

	removeDuplicateParticipations(participations: Participation[]) {
		const uniqueParticipations: { [key: string]: any } = {};

		participations.forEach((item) => {
			const key = `${item.userCode}-${item.experienceId}`;

			if (!uniqueParticipations[key]) {
				uniqueParticipations[key] = item; // Guardar la primera aparición
			}
		});

		return Object.values(uniqueParticipations);
	}
}

export const checkInService = new CheckInService(FirebaseDB);
