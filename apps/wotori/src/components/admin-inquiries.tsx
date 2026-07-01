"use client";

import Link from "next/link";
import { AdminNav } from "./admin-nav";
import type { InquiriesResult } from "../lib/fetch-admin-inquiries";

type Props = {
  result: InquiriesResult | null;
  /** True when the Supabase fetch failed (not auth — RSC already verified). */
  loadFailed: boolean;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminInquiries({ result, loadFailed }: Props) {
  const inquiries = result?.inquiries ?? [];
  const pagination = result?.pagination;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <AdminNav />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Inquiries</h1>
          <p className="text-gray-600">
            Project requests submitted through the site.
          </p>
        </div>
        {pagination && pagination.total > 0 && (
          <span className="text-sm text-gray-600">
            {pagination.total.toLocaleString()} total
          </span>
        )}
      </div>

      {loadFailed && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          Could not load inquiries. Check the Supabase configuration and that the{" "}
          <code className="rounded bg-red-100 px-1">project_inquiries</code> table
          exists.
        </div>
      )}

      {!loadFailed && inquiries.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-gray-500 shadow-sm">
          No inquiries yet.
        </div>
      )}

      {!loadFailed && inquiries.length > 0 && (
        <div className="flex flex-col gap-4">
          {inquiries.map((q) => (
            <article
              key={q.id}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{q.name}</h2>
                  <a
                    href={`mailto:${q.email}`}
                    className="text-sm font-medium text-purple-700 hover:underline"
                  >
                    {q.email}
                  </a>
                </div>
                <time className="text-sm text-gray-500" dateTime={q.created_at}>
                  {formatDate(q.created_at)}
                </time>
              </div>

              {(q.budget || q.timeline) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {q.budget && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      Budget: {q.budget}
                    </span>
                  )}
                  {q.timeline && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      Timeline: {q.timeline}
                    </span>
                  )}
                </div>
              )}

              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
                {q.message}
              </p>

              {q.ip_address && (
                <p className="mt-3 text-xs text-gray-400">IP {q.ip_address}</p>
              )}
            </article>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
          <PagerLink
            page={pagination.page - 1}
            disabled={pagination.page <= 1}
            label="‹ Prev"
          />
          <span className="text-sm text-gray-600">
            Page{" "}
            <span className="font-medium text-gray-900">{pagination.page}</span> of{" "}
            <span className="font-medium text-gray-900">
              {pagination.totalPages}
            </span>
          </span>
          <PagerLink
            page={pagination.page + 1}
            disabled={pagination.page >= pagination.totalPages}
            label="Next ›"
          />
        </div>
      )}
    </div>
  );
}

function PagerLink({
  page,
  disabled,
  label,
}: {
  page: number;
  disabled: boolean;
  label: string;
}) {
  if (disabled) {
    return (
      <span className="cursor-not-allowed rounded border border-gray-200 px-3 py-1 text-sm text-gray-300">
        {label}
      </span>
    );
  }
  return (
    <Link
      href={`/admin/inquiries?page=${page}`}
      className="rounded border border-gray-200 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-50"
    >
      {label}
    </Link>
  );
}
