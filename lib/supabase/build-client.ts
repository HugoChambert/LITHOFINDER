import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// A plain Supabase client for use at build time (generateStaticParams).
// Does not depend on cookies or Next.js request context.
export function createBuildClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
