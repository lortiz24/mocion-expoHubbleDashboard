import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyAohyXq3R4t3ao7KFzLDY7W6--g6kOuS7Q',
	authDomain: 'eviusauthdev.firebaseapp.com',
	databaseURL: 'https://eviusauthdev-default-rtdb.firebaseio.com',
	projectId: 'eviusauthdev',
	storageBucket: 'eviusauthdev.appspot.com',
	messagingSenderId: '86708016609',
	appId: '1:86708016609:web:129d087ffa3077a1ef2ea0',
};

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseDB = getFirestore(FirebaseApp);

export class CheckInServiceJS {
	eventId = '65747321300474a2240776e6'; // Todo: Aquí coloca el id del evento
	experienceId = 'i0own9qlUQ'; // Todo: Aquí coloca el id de la experiencia asignada
	participationCollection;
	attendeesCollection;
	experiences = [
		{
			id: 'i0own9qlUQ',
			name: 'EXPERIENCIA HUBBELL - HOLOGRAMA INTERACTIVO',
		},
		{
			id: 'KbCLd9hZ3r',
			name: 'EXPERIENCIA WIRING - JUEGO DE DESTREZA EN TÓTEM',
		},
		{
			id: 'cyhH5yUGs5',
			name: 'CHANCE LINEMAN TOOLS - MEMORY MATCH',
		},
		{
			id: 'HI0qLLtutT',
			name: 'EXPERIENCIA KILLARK - TRIVIA EN TÓTEM',
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
			name: 'EXPERIENCIA RACO - JUEGO DE DESTREZA EN TÓTEM',
		},
	];

	constructor(firebaseDB) {
		this.participationCollection = collection(firebaseDB, `event/${this.eventId}/usersActivityIntoExperiences`);
		this.attendeesCollection = collection(firebaseDB, `/${this.eventId}_event_attendees`);
	}

	async getUserParticipation({ userCode }) {
		const q = query(this.participationCollection, where('userCode', '==', userCode), where('experienceId', '==', this.experienceId));
		const querySnapshot = await getDocs(q);

		if (!querySnapshot.empty) {
			const participation = {
				id: querySnapshot.docs[0].id,
				...querySnapshot.docs[0].data(),
			};
			return participation;
		} else {
			return null;
		}
	}

	async getUsersParticipation() {
		const querySnapshot = await getDocs(this.participationCollection);
		if (!querySnapshot.empty) {
			const usersParticipation = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			return usersParticipation;
		} else {
			return [];
		}
	}

	async saveUserParticipation({ userCode, checkInAt = new Date().toUTCString(), points = 0 }) {
		const attendee = await this.getAttendeeByUserCode({ userCode });
		if (attendee === null) throw Error('404');

		const previousParticipation = await this.getUserParticipation({ userCode });
		if (previousParticipation) {
			const docId = previousParticipation.id;
			const userExperienceRef = doc(this.firebaseDB, `event/${this.eventId}/usersActivityIntoExperiences`, docId);
			await updateDoc(userExperienceRef, { points });
			return docId;
		} else {
			const experience = this.getExperienceById({ experienceId: this.experienceId });
			const attendee = await this.getAttendeeByUserCode({ userCode });

			if (!attendee) return console.error('El código no está registrado');

			const newDoc = {
				userCode,
				checkInAt,
				experienceId: this.experienceId,
				experienceName: experience.name,
				points,
				email: attendee.properties.email,
				names: attendee.properties.names,
			};
			const newDocRef = await addDoc(this.participationCollection, newDoc);
			return newDocRef.id;
		}
	}

	async getAttendeeByUserCode({ userCode }) {
		const q = query(this.attendeesCollection, where('user_code', '==', userCode));
		const querySnapshot = await getDocs(q);

		if (!querySnapshot.empty) {
			if (querySnapshot.docs.length > 1) throw new Error('Código asignado a dos usuarios');

			const docId = querySnapshot.docs[0].id;
			const data = querySnapshot.docs[0].data();
			const attendee = {
				id: docId,
				...data,
			};
			return attendee;
		}
		return null;
	}

	async getAllAttendee() {
		const snapshot = await getDocs(this.attendeesCollection);
		const attendees = [];
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

	getExperienceById({ experienceId }) {
		const experience = this.experiences.find((experience) => experience.id === experienceId);
		return experience;
	}
}

export const checkInServiceJs = new CheckInServiceJS(FirebaseDB);
