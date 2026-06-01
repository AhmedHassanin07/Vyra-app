/**
 * Authentication Context
 * Manages global auth state and provides auth methods to all components
 */

import AuthService from '@/services/auth-service';
import { getUserDoc } from '@/services/firestore-service';
import { AuthContextType } from '@/types/auth';
import { User } from '@/types/user';
import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useEffect, useState } from 'react';

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const segments = useSegments();

  /**
   * Listen to Firebase auth state changes on mount
   * Also handles routing based on auth and onboarding status
   */
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged(async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          // User signed out
          setUser(null);
          setLoading(false);
          return;
        }

        // User signed in, get their Firestore document
        const userDoc = await getUserDoc(firebaseUser.uid);
        if (userDoc) {
          setUser(userDoc);
        } else {
          // Firestore doc doesn't exist, sign them out
          await AuthService.logout();
          setUser(null);
          setError('User profile not found');
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setError(err instanceof Error ? err.message : 'Authentication error');
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  /**
   * Handle routing based on auth state
   */
  useEffect(() => {
    if (loading) {
      // Still checking auth state
      return;
    }

    // Determine which route group user should be in
    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!user) {
      // Not authenticated - send to login
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    } else if (!user.onboardingComplete) {
      // Authenticated but not onboarded - send to onboarding
      if (!inOnboardingGroup) {
        router.replace('/(onboarding)/complete-profile');
      }
    } else {
      // Fully authenticated and onboarded - send to home tabs
      if (!inTabsGroup) {
        router.replace('/(tabs)/home');
      }
    }
  }, [user, loading, segments, router]);

  /**
   * Login with email and password
   */
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const user = await AuthService.login(email, password);
      setUser(user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    }
  };

  /**
   * Signup with email, password, and display name
   */
  const signup = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      const user = await AuthService.signup(email, password, displayName);
      setUser(user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      setError(message);
      throw err;
    }
  };

  /**
   * Logout current user
   */
  const logout = async () => {
    try {
      setError(null);
      await AuthService.logout();
      setUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      setError(message);
      throw err;
    }
  };

  /**
   * Send password reset email
   */
  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await AuthService.resetPassword(email);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      setError(message);
      throw err;
    }
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated: user !== null,
    login,
    signup,
    logout,
    resetPassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
