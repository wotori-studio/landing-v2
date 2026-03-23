"use server";

import { headers } from "next/headers";
import { createHash } from "crypto";
import { createClient } from "@supabase/supabase-js";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
/** First-party id from localStorage (UUID or generated fallback) */
const VISITOR_KEY_RE = /^[\w.-]{8,256}$/;

/**
 * Privacy-friendly analytics tracking Server Action
 *
 * visitor_hash = SHA-256(visitorKey + "|" + clientLocalDate)
 * - visitorKey: first-party random id in localStorage (stable per browser until cleared)
 * - clientLocalDate: visitor's local calendar YYYY-MM-DD (same id all day on same device)
 * Raw IP is never stored. Geo comes from Vercel headers only.
 */
export async function trackEvent(
  domain: string,
  path: string,
  visitorKey: string,
  clientLocalDate: string
): Promise<void> {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("[Analytics] Supabase not configured, skipping event tracking");
      return;
    }

    if (
      !visitorKey ||
      !VISITOR_KEY_RE.test(visitorKey) ||
      !clientLocalDate ||
      !DATE_RE.test(clientLocalDate)
    ) {
      console.warn("[Analytics] Invalid visitor key or date, skipping");
      return;
    }

    const headersList = await headers();

    const countryRaw = headersList.get("x-vercel-ip-country") || null;
    const cityRaw = headersList.get("x-vercel-ip-city") || null;
    const continentRaw = headersList.get("x-vercel-ip-continent") || null;
    const userAgent = headersList.get("user-agent") || null;

    const country = countryRaw ? decodeURIComponent(countryRaw) : null;
    const city = cityRaw ? decodeURIComponent(cityRaw) : null;
    const continent = continentRaw ? decodeURIComponent(continentRaw) : null;

    // Stable per browser per calendar day (client local date); not tied to rotating IP / CGNAT
    const visitorHash = createHash("sha256")
      .update(`${visitorKey}|${clientLocalDate}`, "utf8")
      .digest("hex");

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase.from("analytics_events").insert({
      domain,
      path,
      visitor_hash: visitorHash,
      user_agent: userAgent,
      continent,
      country,
      city,
    });

    if (error) {
      console.error("[Analytics] Failed to track event:", error.message);
    }
  } catch (error) {
    console.error("[Analytics] Unexpected error in trackEvent:", error);
  }
}
