/**
 * Firebase initialization
 * This module initializes Firebase and exports references to auth and firestore
 */

import { FIREBASE_CONFIG, validateFirebaseConfig } from '@/constants/firebase';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Validate config before initializing
validateFirebaseConfig();

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);

// Initialize Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Uncomment to use Firebase emulators locally (for development)
// const host = 'localhost';
// const port = 9099;
// connectAuthEmulator(auth, `http://${host}:${port}`, { disableWarnings: true });
// connectFirestoreEmulator(db, host, 8080);

export default app;
