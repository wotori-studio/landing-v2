import Link from "next/link";
import { AdminNav } from "./admin-nav";

export function AdminHub() {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <AdminNav />
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin</h1>
        <p className="text-gray-600">
          Choose a section. More tools can be added here as separate pages under{" "}
          <code className="text-sm bg-gray-100 px-1 rounded">/admin/…</code>.
        </p>
      </header>
      <div className="max-w-xl">
        <Link
          href="/admin/analytics"
          className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:border-gray-300 hover:shadow transition"
        >
          <h2 className="text-lg font-semibold text-gray-900">Analytics</h2>
          <p className="mt-1 text-sm text-gray-600">
            Visitor stats, paths, locations, and recent events.
          </p>
        </Link>
      </div>
    </div>
  );
}
