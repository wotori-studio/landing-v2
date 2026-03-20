import { createClient } from "@supabase/supabase-js";

// Using server-side only variables (no NEXT_PUBLIC_ prefix) for security
// These are only used in Server Actions, not in client components
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Missing Supabase environment variables. Please check your .env.local file."
  );
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Server-side client with service role key (for admin operations)
export function createServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey || !supabaseUrl) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
