import { redirect } from "next/navigation";
import { verifyAdminSession } from "../../actions/admin-auth";
import { AdminDashboard } from "../../../components/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const isAuthenticated = await verifyAdminSession();

  if (!isAuthenticated) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboard />
    </div>
  );
}
