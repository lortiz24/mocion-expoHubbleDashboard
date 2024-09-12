// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
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

const firebaseRealtime = getDatabase(FirebaseApp);
