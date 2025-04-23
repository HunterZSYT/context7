import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type Database } from '@/types/supabase';

export function createServerSupabaseClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookiesStore = await cookies();
          return cookiesStore.get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            const cookiesStore = await cookies();
            cookiesStore.set({ name, value, ...options });
          } catch {
            // This can happen when attempting to set cookies in a Server Component.
            // We can safely ignore this error.
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            const cookiesStore = await cookies();
            cookiesStore.set({ name, value: '', ...options });
          } catch {
            // This can happen when attempting to delete cookies in a Server Component.
            // We can safely ignore this error.
          }
        },
      },
    }
  );
}

// Create a single supabase client for client-side components
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Create admin client with additional privileges (for server-side only)
export const createAdminClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
};