"use server";

import { createServerClient } from "../../lib/supabase";
import { verifyAdminSession } from "./admin-auth";

export interface AnalyticsStats {
  totalViews: number;
  uniqueVisitors: number;
  viewsByPath: Array<{ path: string; views: number; uniqueVisitors: number }>;
  viewsByCountry: Array<{ country: string; views: number }>;
  dailyStats: Array<{ date: string; views: number; uniqueVisitors: number }>;
  recentEvents: Array<{
    id: string;
    domain: string;
    path: string;
    country: string | null;
    city: string | null;
    created_at: string;
  }>;
}

/**
 * Get analytics statistics
 * Requires admin authentication
 */
export async function getAnalyticsStats(
  domain?: string,
  days: number = 30
): Promise<AnalyticsStats | null> {
  // Verify admin session
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    return null;
  }

  try {
    const supabase = createServerClient();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString();

    // Build query with optional domain filter
    let query = supabase
      .from("analytics_events")
      .select("*")
      .gte("created_at", startDateStr)
      .order("created_at", { ascending: false });

    if (domain) {
      query = query.eq("domain", domain);
    }

    const { data: events, error } = await query;

    if (error) {
      console.error("[Admin Analytics] Error fetching data:", error);
      return null;
    }

    if (!events || events.length === 0) {
      return {
        totalViews: 0,
        uniqueVisitors: 0,
        viewsByPath: [],
        viewsByCountry: [],
        dailyStats: [],
        recentEvents: [],
      };
    }

    // Calculate statistics
    const uniqueVisitors = new Set(events.map((e) => e.visitor_hash)).size;
    const totalViews = events.length;

    // Views by path
    const pathMap = new Map<string, Set<string>>();
    events.forEach((event) => {
      const path = event.path || "/";
      if (!pathMap.has(path)) {
        pathMap.set(path, new Set());
      }
      pathMap.get(path)!.add(event.visitor_hash);
    });

    const viewsByPath = Array.from(pathMap.entries())
      .map(([path, visitors]) => ({
        path,
        views: events.filter((e) => e.path === path).length,
        uniqueVisitors: visitors.size,
      }))
      .sort((a, b) => b.views - a.views);

    // Views by country
    const countryMap = new Map<string, number>();
    events.forEach((event) => {
      const country = event.country || "Unknown";
      countryMap.set(country, (countryMap.get(country) || 0) + 1);
    });

    const viewsByCountry = Array.from(countryMap.entries())
      .map(([country, views]) => ({ country, views }))
      .sort((a, b) => b.views - a.views);

    // Daily stats
    const dailyMap = new Map<
      string,
      { views: number; visitors: Set<string> }
    >();
    events.forEach((event) => {
      const date = new Date(event.created_at).toISOString().split("T")[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { views: 0, visitors: new Set() });
      }
      const day = dailyMap.get(date)!;
      day.views++;
      day.visitors.add(event.visitor_hash);
    });

    const dailyStats = Array.from(dailyMap.entries())
      .map(([date, data]) => ({
        date,
        views: data.views,
        uniqueVisitors: data.visitors.size,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Recent events (last 50)
    const recentEvents = events.slice(0, 50).map((event) => ({
      id: event.id,
      domain: event.domain,
      path: event.path,
      country: event.country,
      city: event.city,
      created_at: event.created_at,
    }));

    return {
      totalViews,
      uniqueVisitors,
      viewsByPath,
      viewsByCountry,
      dailyStats,
      recentEvents,
    };
  } catch (error) {
    console.error("[Admin Analytics] Unexpected error:", error);
    return null;
  }
}
