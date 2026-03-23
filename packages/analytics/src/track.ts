"use server";

import { headers } from "next/headers";
import { createHash } from "crypto";
import { createClient } from "@supabase/supabase-js";

/** First-party id from localStorage (UUID or generated fallback) */
const VISITOR_KEY_RE = /^[\w.-]{8,256}$/;

/** Public version string mixed into the hash (not secret; avoids cross-project collisions). */
const VISITOR_HASH_PREFIX = "repo_analytics_visitor_v2|";

/**
 * Privacy-friendly analytics tracking Server Action
 *
 * visitor_hash = SHA-256(VISITOR_HASH_PREFIX + visitorKey)
 * - visitorKey: random id in localStorage, stable across days until the user clears site data
 * - Same browser profile → same visitor_hash on every visit (cross-day “returning visitor”)
 * Raw IP is never stored. Geo comes from Vercel headers only.
 */
export async function trackEvent(
  domain: string,
  path: string,
  visitorKey: string
): Promise<void> {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("[Analytics] Supabase not configured, skipping event tracking");
      return;
    }

    if (!visitorKey || !VISITOR_KEY_RE.test(visitorKey)) {
      console.warn("[Analytics] Invalid visitor key, skipping");
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

    const visitorHash = createHash("sha256")
      .update(`${VISITOR_HASH_PREFIX}${visitorKey}`, "utf8")
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
