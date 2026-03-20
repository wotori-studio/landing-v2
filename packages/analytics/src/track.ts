"use server";

import { headers } from "next/headers";
import { createHash } from "crypto";
import { createClient } from "@supabase/supabase-js";

/**
 * Privacy-friendly analytics tracking Server Action
 * 
 * This function:
 * - Collects visitor data from Vercel headers
 * - Anonymizes IP addresses using SHA-256 hash (IP + User-Agent + date)
 * - Stores data in Supabase analytics_events table
 * - Never exposes raw IP addresses (GDPR-compliant)
 * - Fails silently to not break the site if database is unavailable
 * 
 * @param domain - Website domain (e.g., "wotori.io")
 * @param path - Page path (e.g., "/" or "/pricing")
 */
export async function trackEvent(domain: string, path: string): Promise<void> {
  try {
    // Get Supabase configuration from environment variables
    // Using server-side only variables (no NEXT_PUBLIC_ prefix) for security
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    // Silently fail if Supabase is not configured
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("[Analytics] Supabase not configured, skipping event tracking");
      return;
    }

    // Get headers from Next.js
    const headersList = await headers();

    // Extract data from Vercel headers
    const forwardedFor = headersList.get("x-forwarded-for") || "127.0.0.1";
    // Get the first IP if there are multiple (proxy chain)
    const ip = forwardedFor.split(",")[0].trim();
    
    // Decode URL-encoded values from Vercel headers
    const countryRaw = headersList.get("x-vercel-ip-country") || null;
    const cityRaw = headersList.get("x-vercel-ip-city") || null;
    const continentRaw = headersList.get("x-vercel-ip-continent") || null;
    const userAgent = headersList.get("user-agent") || null;

    // Decode URL-encoded strings (e.g., "Santa%20Clara" -> "Santa Clara")
    const country = countryRaw ? decodeURIComponent(countryRaw) : null;
    const city = cityRaw ? decodeURIComponent(cityRaw) : null;
    const continent = continentRaw ? decodeURIComponent(continentRaw) : null;

    // Generate current date in YYYY-MM-DD format for daily visitor hash
    const today = new Date().toISOString().split("T")[0];

    // Create anonymized visitor hash: SHA-256(IP + User-Agent + date)
    // This creates a unique identifier per visitor per day
    // Raw IP is never stored (GDPR-compliant)
    const hashInput = `${ip}${userAgent || ""}${today}`;
    const visitorHash = createHash("sha256").update(hashInput).digest("hex");

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Insert event into database asynchronously
    // This won't block the page render
    const { error } = await supabase.from("analytics_events").insert({
      domain,
      path,
      visitor_hash: visitorHash,
      user_agent: userAgent,
      continent,
      country,
      city,
    });

    // Log error but don't throw (fail silently)
    if (error) {
      console.error("[Analytics] Failed to track event:", error.message);
    }
  } catch (error) {
    // Catch any unexpected errors and log them
    // Never throw to prevent breaking the site
    console.error("[Analytics] Unexpected error in trackEvent:", error);
  }
}
