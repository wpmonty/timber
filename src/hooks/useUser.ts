import { useSession } from 'next-auth/react';
import { SessionUser } from '@/types/auth.types';

export interface UseUserReturn {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export const useUser = (): UseUserReturn => {
  const { data: session, status } = useSession();

  return {
    user: session?.user || null,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    error: null, // NextAuth doesn't expose error status directly
  };
};
