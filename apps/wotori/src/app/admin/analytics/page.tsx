import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "../../actions/admin-auth";
import { fetchAnalyticsStatsFromDb } from "../../../lib/fetch-admin-analytics";
import { AdminDashboard } from "../../../components/admin-dashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin Analytics",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

const ALLOWED_DAYS = [7, 30, 90] as const;

function parseDays(raw: string | undefined): number {
  const n = parseInt(raw ?? "30", 10);
  return ALLOWED_DAYS.includes(n as (typeof ALLOWED_DAYS)[number]) ? n : 30;
}

/** Recent Events list page (1-based), query key `epage` */
function parseEventsPage(raw: string | undefined): number {
  const n = parseInt(raw ?? "1", 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: { days?: string; epage?: string };
}) {
  const isAuthenticated = await verifyAdminSession();

  if (!isAuthenticated) {
    redirect("/admin");
  }

  const days = parseDays(searchParams?.days);
  const eventsPage = parseEventsPage(searchParams?.epage);
  const stats = await fetchAnalyticsStatsFromDb(undefined, days, eventsPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboard
        initialStats={stats}
        initialDays={days}
        loadFailed={stats === null}
      />
    </div>
  );
}
