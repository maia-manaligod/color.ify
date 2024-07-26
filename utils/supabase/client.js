import { createBrowserClient } from '@supabase/ssr'
//creates a supabase instance that runs through browser


export function createClient() {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(
    //exclamation points were deleted
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}