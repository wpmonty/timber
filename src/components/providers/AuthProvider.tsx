'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase';
import { AuthUser, AuthContextType, AuthError } from '@/types/auth.types';

// Create the auth context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state and listen for changes
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      setUser((session?.user as AuthUser) ?? null);
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);

      setUser((session?.user as AuthUser) ?? null);
      setIsLoading(false);

      // Handle auth events
      if (event === 'SIGNED_IN') {
        // Store tokens in cookies for server-side access
        if (session?.access_token && session?.refresh_token) {
          document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=3600; secure; samesite=strict`;
          document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; max-age=604800; secure; samesite=strict`;
        }
      } else if (event === 'SIGNED_OUT') {
        // Clear tokens from cookies
        document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.push('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signIn = async (email: string, password: string): Promise<{ error?: AuthError }> => {
    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: { message: error.message } };
      }

      return {};
    } catch (error) {
      return { error: { message: 'An unexpected error occurred' } };
    }
  };

  const signUp = async (email: string, password: string): Promise<{ error?: AuthError }> => {
    try {
      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { error: { message: error.message } };
      }

      return {};
    } catch (error) {
      return { error: { message: 'An unexpected error occurred' } };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await supabaseClient.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      setUser(user as AuthUser);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
