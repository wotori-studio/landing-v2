import { verifyAdminSession } from "../actions/admin-auth";
import { AdminLoginForm } from "../../components/admin-login-form";
import { AdminHub } from "../../components/admin-hub";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAuthenticated = await verifyAdminSession();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <AdminLoginForm />
      </div>
    );
  }

  return <AdminHub />;
}
