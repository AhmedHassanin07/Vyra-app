/**
 * User data type - matches Firestore users/{uid} document
 */

import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  displayName: string; // JavaScript camelCase (not Firestore display_name)
  username: string;
  photoUrl: string;
  earnedCoins: number;
  onboardingComplete: boolean;
  createdAt: Timestamp;
  lastActiveAt: Timestamp;
}

/**
 * Type for Firestore document data (snake_case to match Firestore)
 * This is what we read/write to Firestore
 */
export interface UserFirestoreData {
  uid: string;
  email: string;
  display_name: string;
  username: string;
  photo_url: string;
  earned_coins: number;
  onboarding_complete: boolean;
  created_at: Timestamp;
  last_active_at: Timestamp;
}

/**
 * Conversion helpers between camelCase (JS) and snake_case (Firestore)
 */
export function firestoreDataToUser(data: UserFirestoreData): User {
  return {
    uid: data.uid,
    email: data.email,
    displayName: data.display_name,
    username: data.username,
    photoUrl: data.photo_url,
    earnedCoins: data.earned_coins,
    onboardingComplete: data.onboarding_complete,
    createdAt: data.created_at,
    lastActiveAt: data.last_active_at,
  };
}

export function userToFirestoreData(user: User): UserFirestoreData {
  return {
    uid: user.uid,
    email: user.email,
    display_name: user.displayName,
    username: user.username,
    photo_url: user.photoUrl,
    earned_coins: user.earnedCoins,
    onboarding_complete: user.onboardingComplete,
    created_at: user.createdAt,
    last_active_at: user.lastActiveAt,
  };
}
