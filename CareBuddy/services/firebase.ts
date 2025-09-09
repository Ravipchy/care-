import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, initializeAuth, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? (Constants as any).manifest?.extra ?? {};

const firebaseConfig = {
	apiKey: extra.firebaseApiKey,
	authDomain: extra.firebaseAuthDomain,
	projectId: extra.firebaseProjectId,
	storageBucket: extra.firebaseStorageBucket,
	messagingSenderId: extra.firebaseMessagingSenderId,
	appId: extra.firebaseAppId,
	measurementId: extra.firebaseMeasurementId,
};

let app: FirebaseApp;
if (!getApps().length) {
	app = initializeApp(firebaseConfig);
} else {
	app = getApps()[0]!;
}

// Initialize Auth with persistence for web; native uses default
const auth = getAuth(app);
try {
	initializeAuth(app, { persistence: browserLocalPersistence });
} catch {}

export const firebaseAuth = auth;
export const firebaseDb = getFirestore(app);
export const firebaseStorage = getStorage(app);


