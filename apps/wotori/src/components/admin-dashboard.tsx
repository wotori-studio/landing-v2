"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAnalyticsStats, type AnalyticsStats } from "../app/actions/admin-analytics";
import { logoutAdmin } from "../app/actions/admin-auth";

export function AdminDashboard() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDays, setSelectedDays] = useState(30);
  const router = useRouter();

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDays]);

  async function loadStats() {
    setIsLoading(true);
    setError("");

    try {
      const data = await getAnalyticsStats(undefined, selectedDays);

      if (data === null) {
        setError("Failed to load analytics. You may need to log in again.");
        setTimeout(() => {
          router.push("/admin/login");
        }, 2000);
        return;
      }

      setStats(data);
    } catch (err) {
      setError("An error occurred while loading analytics.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    await logoutAdmin();
    router.push("/admin/login");
    router.refresh();
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">Visitor statistics and insights</p>
        </div>
        <div className="flex gap-4 items-center">
          <select
            value={selectedDays}
            onChange={(e) => setSelectedDays(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Logout
          </button>
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
              {stats.recentEvents.slice(0, 20).map((event) => (
                <tr key={event.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(event.created_at).toLocaleString()}
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
                      // Decode URL-encoded values if they exist (for old records)
                      const city = event.city ? decodeURIComponent(event.city) : null;
                      const country = event.country ? decodeURIComponent(event.country) : null;
                      return city && country
                        ? `${city}, ${country}`
                        : country || "Unknown";
                    })()}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {event.user_agent ? (
                      <span className="text-xs" title={event.user_agent}>
                        {(() => {
                          // Parse user agent to show device/browser info
                          const ua = event.user_agent;
                          // Extract browser
                          let browser = "Unknown";
                          if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
                          else if (ua.includes("Firefox")) browser = "Firefox";
                          else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
                          else if (ua.includes("Edg")) browser = "Edge";
                          else if (ua.includes("Opera")) browser = "Opera";
                          
                          // Extract device
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
