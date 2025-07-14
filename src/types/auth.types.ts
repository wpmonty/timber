import type { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  emailVerified?: boolean;
  name?: string;
  image?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
  success: boolean;
}

export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

// Extending NextAuth types
declare module 'next-auth' {
  interface Session {
    user: SessionUser;
    accessToken?: string;
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name?: string;
    image?: string;
    accessToken?: string;
  }
}
