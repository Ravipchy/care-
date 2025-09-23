import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration - Replace with your actual config from google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyAOkOcDuPBftjBZmEQO4IMyTp1H2oQZbzQ",
  authDomain: "carebuddy-57930.firebaseapp.com",
  databaseURL: "https://carebuddy-57930-default-rtdb.firebaseio.com",
  projectId: "carebuddy-57930",
  storageBucket: "carebuddy-57930.firebasestorage.app",
  messagingSenderId: "1002774404066",
  appId: "1:1002774404066:android:b55b4ddc633d0e105fb7bb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);
export const database = getDatabase(app);

export default app;
