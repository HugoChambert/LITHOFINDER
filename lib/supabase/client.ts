import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // During build time, return a mock client to prevent pre-rendering errors
  if (!url || !key) {
    return createBrowserClient('https://placeholder.supabase.co', 'placeholder-key');
  }

  return createBrowserClient(url, key);
}
