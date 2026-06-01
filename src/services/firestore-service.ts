/**
 * Firestore Service
 * Handles all Firestore database operations for users and usernames
 */

import { firestoreDataToUser, User, UserFirestoreData } from '@/types/user';
import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    Timestamp,
    updateDoc,
    writeBatch
} from 'firebase/firestore';
import { db } from './firebase-config';

const USERS_COLLECTION = 'users';
const USERNAMES_COLLECTION = 'usernames';

export interface CreateUserInput {
  uid: string;
  email: string;
  displayName: string;
  username: string;
  photoUrl: string;
  earnedCoins: number;
  onboardingComplete: boolean;
}

/**
 * Create a new user document in Firestore
 * Called during signup (before onboarding)
 */
export async function createUserDoc(input: CreateUserInput): Promise<User> {
  const userRef = doc(db, USERS_COLLECTION, input.uid);

  const firestoreData: UserFirestoreData = {
    uid: input.uid,
    email: input.email,
    display_name: input.displayName,
    username: input.username,
    photo_url: input.photoUrl,
    earned_coins: input.earnedCoins,
    onboarding_complete: input.onboardingComplete,
    created_at: serverTimestamp() as Timestamp,
    last_active_at: serverTimestamp() as Timestamp,
  };

  await setDoc(userRef, firestoreData);

  // Return the created user with timestamps
  return {
    ...input,
    createdAt: Timestamp.now(),
    lastActiveAt: Timestamp.now(),
  };
}

/**
 * Get user document from Firestore
 */
export async function getUserDoc(uid: string): Promise<User | null> {
  const userRef = doc(db, USERS_COLLECTION, uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data() as UserFirestoreData;
  return firestoreDataToUser(data);
}

/**
 * Update user document
 * Used during onboarding to add username and set onboarding_complete
 */
export async function updateUser(
  uid: string,
  updates: Partial<{
    display_name: string;
    username: string;
    photo_url: string;
    onboarding_complete: boolean;
  }>
): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, uid);

  const updateData: any = {
    ...updates,
    last_active_at: serverTimestamp(),
  };

  await updateDoc(userRef, updateData);
}

/**
 * Check if a username is available (not taken)
 * Returns true if username exists (is taken)
 * Normalizes username with trim() and toLowerCase()
 */
export async function isUsernameUsed(username: string): Promise<boolean> {
  const normalizedUsername = username.trim().toLowerCase();
  const usernameRef = doc(db, USERNAMES_COLLECTION, normalizedUsername);
  const docSnap = await getDoc(usernameRef);
  return docSnap.exists();
}

/**
 * Claim a username for a user during onboarding
 * Creates a document in the usernames collection to reserve the username
 * Normalizes username with trim() and toLowerCase() before claiming
 * This must be called in onboarding after validating username is available
 */
export async function claimUsername(uid: string, username: string): Promise<void> {
  const normalizedUsername = username.trim().toLowerCase();
  const usernameRef = doc(db, USERNAMES_COLLECTION, normalizedUsername);

  // This will fail if the document already exists (username taken)
  // Firestore security rules also validate that uid matches auth.uid
  await setDoc(usernameRef, {
    username: normalizedUsername,
    uid,
  });
}

/**
 * Complete onboarding by creating username doc and updating user doc
 * Normalizes username with trim() and toLowerCase() before saving
 * Uses a batch write to ensure both operations succeed or both fail
 */
export async function completeOnboarding(
  uid: string,
  username: string,
  displayName?: string
): Promise<void> {
  const normalizedUsername = username.trim().toLowerCase();
  const batch = writeBatch(db);

  // Create username reservation
  const usernameRef = doc(db, USERNAMES_COLLECTION, normalizedUsername);
  batch.set(usernameRef, {
    username: normalizedUsername,
    uid,
  });

  // Update user document
  const userRef = doc(db, USERS_COLLECTION, uid);
  const updateData: any = {
    username: normalizedUsername,
    onboarding_complete: true,
    last_active_at: serverTimestamp(),
  };

  if (displayName) {
    updateData.display_name = displayName;
  }

  batch.update(userRef, updateData);

  // Commit both operations atomically
  await batch.commit();
}

export default {
  createUserDoc,
  getUserDoc,
  updateUser,
  isUsernameUsed,
  claimUsername,
  completeOnboarding,
};
