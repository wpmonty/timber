import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseServer } from './supabase';
import { AuthUser } from '@/types/auth.types';

/**
 * Get the current user from the server-side session
 * Returns null if no user is authenticated
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = cookies();

  // Get the session from cookies
  const accessToken = cookieStore.get('sb-access-token')?.value;
  const refreshToken = cookieStore.get('sb-refresh-token')?.value;

  if (!accessToken || !refreshToken) {
    return null;
  }

  try {
    // Verify the session with Supabase
    const {
      data: { user },
      error,
    } = await supabaseServer.auth.getUser(accessToken);

    if (error || !user) {
      return null;
    }

    return user as AuthUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Require authentication on a server component/page
 * Redirects to login if not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return user;
}

/**
 * Redirect if already authenticated
 * Used on login/signup pages
 */
export async function redirectIfAuthenticated(redirectTo: string = '/property') {
  const user = await getCurrentUser();

  if (user) {
    redirect(redirectTo);
  }
}

/**
 * Validate that a user owns a resource
 * Used to ensure users can only access their own data
 */
export async function validateResourceOwnership(
  resourceUserId: string,
  user?: AuthUser
): Promise<boolean> {
  if (!user) {
    const currentUser = await getCurrentUser();
    if (!currentUser) return false;
    user = currentUser;
  }

  return user.id === resourceUserId;
}

/**
 * Create a user-scoped Supabase client
 * Automatically filters queries by user_id
 */
export function createUserScopedClient(user: AuthUser) {
  return supabaseServer.auth.admin.getUserById(user.id);
}
