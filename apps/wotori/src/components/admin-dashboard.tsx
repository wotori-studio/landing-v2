"use client";

import { useRouter } from "next/navigation";
import type { AnalyticsStats } from "../lib/fetch-admin-analytics";
import { AdminNav } from "./admin-nav";
import {
  buildAnalyticsUrl,
  RecentEventsPaginationBar,
} from "./recent-events-pagination";

type Props = {
  initialStats: AnalyticsStats | null;
  initialDays: number;
  /** True when DB / Supabase fetch failed (not auth — RSC already verified). */
  loadFailed: boolean;
};

export function AdminDashboard({
  initialStats,
  initialDays,
  loadFailed,
}: Props) {
  const router = useRouter();

  if (loadFailed || !initialStats) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <AdminNav />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg">
            <p className="text-red-800 font-medium mb-2">
              Failed to load analytics
            </p>
            <p className="text-red-700 text-sm mb-4">
              This is usually a database configuration issue (not your login).
              Confirm{" "}
              <code className="bg-red-100 px-1 rounded text-xs">
                SUPABASE_SERVICE_ROLE_KEY
              </code>{" "}
              and{" "}
              <code className="bg-red-100 px-1 rounded text-xs">
                SUPABASE_URL
              </code>{" "}
              are set on the server, and the{" "}
              <code className="bg-red-100 px-1 rounded text-xs">
                analytics_events
              </code>{" "}
              table exists.
            </p>
            <button
              type="button"
              onClick={() => router.refresh()}
              className="text-sm px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-900"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = initialStats;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <AdminNav />
      {/* Header */}
      <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">Visitor statistics and insights</p>
        </div>
        <div className="flex gap-4 items-center">
          <select
            value={initialDays}
            onChange={(e) => {
              const v = Number(e.target.value);
              router.push(buildAnalyticsUrl(v, 1));
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Total Page Views
          </h3>
          <p className="text-4xl font-bold text-gray-900">
            {stats.totalViews.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Unique Visitors
          </h3>
          <p className="text-4xl font-bold text-gray-900">
            {stats.uniqueVisitors.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Pages</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Path
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">
                  Views
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">
                  Unique Visitors
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.viewsByPath.slice(0, 10).map((item) => (
                <tr key={item.path} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <code className="text-sm bg-gray-50 px-2 py-1 rounded">
                      {item.path}
                    </code>
                  </td>
                  <td className="text-right py-3 px-4 font-medium">
                    {item.views.toLocaleString()}
                  </td>
                  <td className="text-right py-3 px-4 text-gray-600">
                    {item.uniqueVisitors.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Views by Country */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Views by Country
        </h2>
        <div className="space-y-3">
          {stats.viewsByCountry.slice(0, 10).map((item) => (
            <div key={item.country} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {item.country}
                  </span>
                  <span className="text-sm text-gray-600">
                    {item.views.toLocaleString()} views
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (item.views / stats.totalViews) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Stats */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Daily Stats</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Date
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">
                  Views
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">
                  Unique Visitors
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.dailyStats.slice(-14).map((day) => (
                <tr key={day.date} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="text-right py-3 px-4 font-medium">
                    {day.views.toLocaleString()}
                  </td>
                  <td className="text-right py-3 px-4 text-gray-600">
                    {day.uniqueVisitors.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Events</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Time
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Domain
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Path
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Location
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  User Agent
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.recentEvents.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-gray-500 text-sm"
                  >
                    No events in this date range.
                  </td>
                </tr>
              )}
              {stats.recentEvents.map((event) => {
                const eventDate = new Date(event.created_at);
                const now = new Date();
                const diffMs = now.getTime() - eventDate.getTime();
                const diffMins = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMs / 3600000);
                const diffDays = Math.floor(diffMs / 86400000);

                let relativeTime = "";
                if (diffMins < 1) relativeTime = "Just now";
                else if (diffMins < 60) relativeTime = `${diffMins}m ago`;
                else if (diffHours < 24) relativeTime = `${diffHours}h ago`;
                else if (diffDays < 7) relativeTime = `${diffDays}d ago`;
                else relativeTime = eventDate.toLocaleDateString();

                return (
                  <tr key={event.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="text-gray-900 font-medium text-sm">
                        {eventDate.toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {relativeTime}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-gray-50 px-2 py-1 rounded">
                        {event.domain}
                      </code>
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-gray-50 px-2 py-1 rounded">
                        {event.path}
                      </code>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {(() => {
                        const city = event.city
                          ? decodeURIComponent(event.city)
                          : null;
                        const country = event.country
                          ? decodeURIComponent(event.country)
                          : null;
                        return city && country
                          ? `${city}, ${country}`
                          : country || "Unknown";
                      })()}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {event.user_agent ? (
                        <span className="text-xs" title={event.user_agent}>
                          {(() => {
                            const ua = event.user_agent;
                            let browser = "Unknown";
                            if (ua.includes("Chrome") && !ua.includes("Edg"))
                              browser = "Chrome";
                            else if (ua.includes("Firefox")) browser = "Firefox";
                            else if (
                              ua.includes("Safari") &&
                              !ua.includes("Chrome")
                            )
                              browser = "Safari";
                            else if (ua.includes("Edg")) browser = "Edge";
                            else if (ua.includes("Opera")) browser = "Opera";

                            let device = "";
                            if (ua.includes("Mobile")) device = "Mobile";
                            else if (ua.includes("Tablet")) device = "Tablet";
                            else device = "Desktop";

                            return `${browser} (${device})`;
                          })()}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Unknown</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <RecentEventsPaginationBar
          days={initialDays}
          pagination={stats.recentEventsPagination}
        />
      </div>
    </div>
  );
}
