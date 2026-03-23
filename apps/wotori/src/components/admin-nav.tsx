"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "../app/actions/admin-auth";

export function AdminNav() {
  const pathname = usePathname();
  const onAdminRoot = pathname === "/admin";
  const onAnalytics = pathname?.startsWith("/admin/analytics") ?? false;

  async function handleLogout() {
    await logoutAdmin();
    window.location.assign("/admin");
  }

  return (
    <nav className="flex flex-wrap items-center gap-4 border-b border-gray-200 pb-4 mb-6">
      <Link
        href="/admin"
        className={`text-sm font-medium ${
          onAdminRoot ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Overview
      </Link>
      <Link
        href="/admin/analytics"
        className={`text-sm font-medium ${
          onAnalytics ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Analytics
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className="text-sm font-medium text-gray-600 hover:text-gray-900 ml-auto"
      >
        Logout
      </button>
    </nav>
  );
}
