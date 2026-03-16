import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // During build time without env vars, return a mock client
  if (!url || !key) {
    return createServerClient(
      'https://placeholder.supabase.co',
      'placeholder-key',
      {
        cookies: {
          getAll() {
            return [];
          },
          setAll() {},
        },
      }
    );
  }

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component - cookies set on response
          }
        },
      },
    }
  );
}
