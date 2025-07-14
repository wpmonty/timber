import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase.types';

// Client-side client for browser usage
export const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Authentication helper functions for client-side
export const authHelpers = {
  async signUp(email: string, password: string, name?: string) {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: name ? { name } : undefined,
      },
    });

    return {
      user: data.user,
      error: error?.message || null,
      success: !error,
    };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    return {
      user: data.user,
      error: error?.message || null,
      success: !error,
    };
  },

  async signOut() {
    const { error } = await supabaseClient.auth.signOut();
    return {
      error: error?.message || null,
      success: !error,
    };
  },

  async getCurrentUser() {
    const { data, error } = await supabaseClient.auth.getUser();
    return {
      user: data.user,
      error: error?.message || null,
      success: !error,
    };
  },
};
