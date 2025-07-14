import { useContext } from 'react';
import { AuthContext } from '@/components/providers/AuthProvider';
import { AuthContextType } from '@/types/auth.types';

/**
 * Custom hook to access authentication context
 * Must be used within AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
