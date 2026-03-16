import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// A plain Supabase client for use at build time (generateStaticParams).
// Does not depend on cookies or Next.js request context.
export function createBuildClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // During build time without env vars, return a mock client
  if (!url || !key) {
    return createSupabaseClient('https://placeholder.supabase.co', 'placeholder-key');
  }

  return createSupabaseClient(url, key);
}
