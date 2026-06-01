/**
 * Firebase Authentication Service
 * Handles login, signup, logout, and password reset operations
 */

import { User } from '@/types/user';
import {
    createUserWithEmailAndPassword,
    User as FirebaseUser,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { auth } from './firebase-config';
import { createUserDoc, getUserDoc } from './firestore-service';

export class AuthService {
  /**
   * Create a new user account with email and password
   * Also creates Firestore user document
   */
  static async signup(email: string, password: string, displayName: string): Promise<User> {
    // Create Firebase Auth account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    if (!firebaseUser.uid) {
      throw new Error('Failed to create user account');
    }

    // Create Firestore user document
    // Username is NOT set yet - will be set during onboarding
    const user = await createUserDoc({
      uid: firebaseUser.uid,
      email: firebaseUser.email || email,
      displayName,
      username: '', // Will be set in onboarding
      photoUrl: '',
      earnedCoins: 0,
      onboardingComplete: false,
    });

    return user;
  }

  /**
   * Sign in with email and password
   */
  static async login(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    if (!firebaseUser.uid) {
      throw new Error('Failed to sign in');
    }

    // Get user doc from Firestore
    const user = await getUserDoc(firebaseUser.uid);

    if (!user) {
      throw new Error('User document not found in Firestore');
    }

    return user;
  }

  /**
   * Sign out current user
   */
  static async logout(): Promise<void> {
    await signOut(auth);
  }

  /**
   * Send password reset email
   */
  static async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  /**
   * Get currently authenticated Firebase user
   */
  static getCurrentFirebaseUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChanged(callback: (firebaseUser: FirebaseUser | null) => void) {
    return auth.onAuthStateChanged(callback);
  }
}

export default AuthService;
