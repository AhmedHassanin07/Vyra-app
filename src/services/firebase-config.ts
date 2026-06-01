/**
 * Firebase initialization
 * This module initializes Firebase and exports references to auth and firestore
 * Uses AsyncStorage for persistent auth state across app restarts
 */

import { FIREBASE_CONFIG, validateFirebaseConfig } from '@/constants/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Validate config before initializing
validateFirebaseConfig();

// Initialize Firebase App (only if not already initialized)
const app = getApps().length > 0 ? getApps()[0] : initializeApp(FIREBASE_CONFIG);

// Initialize Auth with AsyncStorage persistence
// This prevents memory-only persistence and enables session persistence across app restarts
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
export const db = getFirestore(app);

// Uncomment to use Firebase emulators locally (for development)
// const host = 'localhost';
// const port = 9099;
// connectAuthEmulator(auth, `http://${host}:${port}`, { disableWarnings: true });
// connectFirestoreEmulator(db, host, 8080);

export default app;
