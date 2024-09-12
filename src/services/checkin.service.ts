import { addDoc, collection, doc, Firestore, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { FirebaseDB } from '../config/firebase.config';
import { Participation, SaveParticipationOfUser } from '../types/checkIn.type';
import { get, getDatabase, ref } from 'firebase/database';
import { Attendee } from '../types/atendee.type';

export class CheckInService {
	constructor(private readonly firebaseDB: Firestore) {}

	async getParticipation({ eventId, userCode, experienceId }: { eventId: string; userCode: string; experienceId: string }) {
		const participationCollection = collection(this.firebaseDB, `event/${eventId}/usersActivityIntoExperiences`);
		const q = query(participationCollection, where('userCode', '==', userCode), where('experienceId', '==', experienceId));

		const querySnapshot = await getDocs(q);

		if (!querySnapshot.empty) {
			const participation: Participation = {
				id: querySnapshot.docs[0].id,
				...(querySnapshot.docs[0].data() as Omit<Participation, 'id'>),
			};
			return participation as Participation; // Retorna el primer documento encontrado
		} else {
			return null; // Si no se encuentra el documento, retorna null
		}
	}

	async saveParticipationOfUser({ eventId, experienceId, userCode, checkIn = true, points, email, names }: SaveParticipationOfUser) {
		const attendee = await this.getAttendeeByUserCode({ eventId, userCode });

		if (attendee === null) throw Error('404');

		const existingDoc = await this.getParticipation({ eventId, userCode, experienceId });

		if (existingDoc) {
			const docId = existingDoc.id;
			const userExperienceRef = doc(this.firebaseDB, `event/${eventId}/usersActivityIntoExperiences`, docId);

			await updateDoc(userExperienceRef, {
				checkIn,
				points,
			});

			console.log('Documento actualizado:', docId);
			return docId;
		} else {
			// Si no existe, creamos uno nuevo
			const newDoc: Omit<Participation, 'id'> = {
				userCode,
				experienceId,
				checkIn,
				points,
				email,
				names,
			};

			const newDocRef = await addDoc(collection(this.firebaseDB, `event/${eventId}/usersActivityIntoExperiences`), newDoc);
			console.log('Nuevo documento creado con ID:', newDocRef.id);
			return newDocRef.id;
		}
	}

	async getUserParticipationList(eventId: string) {
		const db = getDatabase();

		// Referencia a la ruta de los usuarios y sus experiencias en el evento
		const participationRef = ref(db, `event/${eventId}/usersActivityIntoExperiences`);

		// Obtener los datos de la referencia
		const snapshot = await get(participationRef);

		if (snapshot.exists()) {
			// Convertir los datos en un objeto JavaScript
			const data = snapshot.val();

			// Devolver la lista de userCodes con sus experiencias
			console.log('data', data);
			return data;
		} else {
			console.log('No data available');
			return null;
		}
	}

	async getAttendeeByUserCode({ eventId, userCode }: { eventId: string; userCode: string }): Promise<Attendee | null> {
		const attendeeCollection = collection(this.firebaseDB, `/${eventId}_event_attendees`);
		const q = query(attendeeCollection, where('user_code', '==', userCode));

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

	async getAllAttendee({ eventId }: { eventId: string }) {
		const attendeesCollection = collection(this.firebaseDB, `${eventId}_event_attendees`);
		const snapshot = await getDocs(attendeesCollection);
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
	async getAllExperience({ eventId }: { eventId: string }) {
		const experiencesCollection = collection(this.firebaseDB, `${eventId}_experiences`);
		const snapshot = await getDocs(experiencesCollection);
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
}

export const checkInService = new CheckInService(FirebaseDB);
