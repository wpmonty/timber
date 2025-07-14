import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase.types';

// Server-side client with service role key for admin operations
export const supabaseServer = createClient<Database, 'public'>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Client-side client for auth and user operations
export const supabaseClient = createClient<Database, 'public'>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side auth-aware client for authenticated operations
export const createServerSupabaseClient = (accessToken?: string) => {
  return createClient<Database, 'public'>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      global: {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      },
    }
  );
};
