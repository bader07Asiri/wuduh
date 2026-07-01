import { createClient } from "@supabase/supabase-js";

// Admin Supabase client — uses the Service Role key (bypasses RLS).
// Server-side only. Never import this into a "use client" component.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
