import { createBrowserClient } from '@supabase/ssr';

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true, // Keep user logged in
        autoRefreshToken: true, // Auto refresh before expire
        detectSessionInUrl: true,
        storageKey: 'sahara-mart-auth', // Custom storage key
      },
    }
  );