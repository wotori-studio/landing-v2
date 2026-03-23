"use server";

import { verifyAdminSession } from "./admin-auth";
import {
  fetchAnalyticsStatsFromDb,
  type AnalyticsStats,
} from "../../lib/fetch-admin-analytics";

export type { AnalyticsStats };

/**
 * Server Action: verify session + load analytics.
 * Prefer loading in RSC via fetchAnalyticsStatsFromDb — Server Actions invoked from
 * the client may not receive cookies reliably in all Next.js setups.
 */
export async function getAnalyticsStats(
  domain?: string,
  days: number = 30,
  recentEventsPage: number = 1
): Promise<AnalyticsStats | null> {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    return null;
  }

  return fetchAnalyticsStatsFromDb(domain, days, recentEventsPage);
}
