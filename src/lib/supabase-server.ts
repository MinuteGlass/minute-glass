import { createClient } from "@supabase/supabase-js";

// Client serveur avec service_role — uniquement dans les API routes (jamais côté client)
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
