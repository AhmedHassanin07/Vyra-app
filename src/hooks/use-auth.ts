/**
 * useAuth Hook
 * Provides easy access to auth context in any component
 */

import { AuthContext } from '@/contexts/auth-context';
import { AuthContextType } from '@/types/auth';
import { useContext } from 'react';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}

export default useAuth;
