import { createServerClient } from "./supabase";

export interface RecentEventsPagination {
  /** 1-based, clamped to valid range */
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

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
    user_agent: string | null;
    created_at: string;
  }>;
  recentEventsPagination: RecentEventsPagination;
}

const DEFAULT_RECENT_PAGE_SIZE = 20;

/**
 * Load analytics from Supabase (service role). Call only after verifyAdminSession() in RSC / route handlers.
 */
export async function fetchAnalyticsStatsFromDb(
  domain: string | undefined,
  days: number,
  requestedRecentPage: number = 1,
  recentPageSize: number = DEFAULT_RECENT_PAGE_SIZE
): Promise<AnalyticsStats | null> {
  try {
    const supabase = createServerClient();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString();

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
        recentEventsPagination: {
          page: 1,
          pageSize: recentPageSize,
          total: 0,
          totalPages: 1,
        },
      };
    }

    const uniqueVisitors = new Set(events.map((e) => e.visitor_hash)).size;
    const totalViews = events.length;

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

    const countryMap = new Map<string, number>();
    events.forEach((event) => {
      const country = event.country || "Unknown";
      countryMap.set(country, (countryMap.get(country) || 0) + 1);
    });

    const viewsByCountry = Array.from(countryMap.entries())
      .map(([country, views]) => ({ country, views }))
      .sort((a, b) => b.views - a.views);

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

    const totalRecent = events.length;
    const totalPages = Math.max(1, Math.ceil(totalRecent / recentPageSize));
    let page =
      Number.isFinite(requestedRecentPage) && requestedRecentPage > 0
        ? Math.floor(requestedRecentPage)
        : 1;
    page = Math.min(Math.max(1, page), totalPages);
    const start = (page - 1) * recentPageSize;
    const recentEvents = events
      .slice(start, start + recentPageSize)
      .map((event) => ({
        id: event.id,
        domain: event.domain,
        path: event.path,
        country: event.country,
        city: event.city,
        user_agent: event.user_agent,
        created_at: event.created_at,
      }));

    return {
      totalViews,
      uniqueVisitors,
      viewsByPath,
      viewsByCountry,
      dailyStats,
      recentEvents,
      recentEventsPagination: {
        page,
        pageSize: recentPageSize,
        total: totalRecent,
        totalPages,
      },
    };
  } catch (error) {
    console.error("[Admin Analytics] Unexpected error:", error);
    return null;
  }
}
