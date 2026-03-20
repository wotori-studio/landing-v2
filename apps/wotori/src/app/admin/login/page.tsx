import { redirect } from "next/navigation";
import { verifyAdminSession } from "../../actions/admin-auth";
import { AdminLoginForm } from "../../../components/admin-login-form";

export default async function AdminLoginPage() {
  const isAuthenticated = await verifyAdminSession();

  if (isAuthenticated) {
    redirect("/admin/analytics");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <AdminLoginForm />
    </div>
  );
}
