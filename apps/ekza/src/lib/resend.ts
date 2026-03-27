import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY?.trim();

/**
 * Null when RESEND_API_KEY is unset — never throw at import time (would break
 * every server action that imports this module, e.g. waitlist submit).
 */
export const resend: Resend | null = resendApiKey ? new Resend(resendApiKey) : null;

if (!resendApiKey && process.env.NODE_ENV === "development") {
  console.warn(
    "[ekza] RESEND_API_KEY is missing — waitlist signups still save to Supabase, welcome emails are skipped."
  );
}
