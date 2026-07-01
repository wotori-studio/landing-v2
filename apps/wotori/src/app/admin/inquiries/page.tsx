import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "../../actions/admin-auth";
import { fetchInquiriesFromDb } from "../../../lib/fetch-admin-inquiries";
import { AdminInquiries } from "../../../components/admin-inquiries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin Inquiries",
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

function parsePage(raw: string | undefined): number {
  const n = parseInt(raw ?? "1", 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const isAuthenticated = await verifyAdminSession();

  if (!isAuthenticated) {
    redirect("/admin");
  }

  const page = parsePage(searchParams?.page);
  const result = await fetchInquiriesFromDb(page);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminInquiries result={result} loadFailed={result === null} />
    </div>
  );
}
