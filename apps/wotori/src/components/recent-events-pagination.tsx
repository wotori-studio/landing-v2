"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { RecentEventsPagination } from "../lib/fetch-admin-analytics";

export function buildAnalyticsUrl(days: number, eventsPage: number): string {
  const p = new URLSearchParams();
  p.set("days", String(days));
  if (eventsPage > 1) p.set("epage", String(eventsPage));
  const q = p.toString();
  return q ? `/admin/analytics?${q}` : "/admin/analytics";
}

function getPaginationModel(
  current: number,
  totalPages: number
): Array<number | "ellipsis"> {
  if (totalPages <= 0) return [1];
  if (totalPages <= 9) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const set = new Set<number>([1, totalPages]);
  for (let d = -2; d <= 2; d++) {
    const pg = current + d;
    if (pg >= 1 && pg <= totalPages) set.add(pg);
  }
  const sorted = [...set].sort((a, b) => a - b);
  const out: Array<number | "ellipsis"> = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push("ellipsis");
    out.push(sorted[i]);
  }
  return out;
}

type Props = {
  days: number;
  pagination: RecentEventsPagination;
};

export function RecentEventsPaginationBar({ days, pagination }: Props) {
  const router = useRouter();
  const { page, totalPages, total, pageSize } = pagination;
  const model = useMemo(
    () => getPaginationModel(page, totalPages),
    [page, totalPages]
  );
  const [jump, setJump] = useState(String(page));

  useEffect(() => {
    setJump(String(page));
  }, [page]);

  const go = (p: number) => {
    // Avoid jumping to top on every page change (full RSC navigation otherwise scrolls).
    router.push(buildAnalyticsUrl(days, p), { scroll: false });
  };

  const onJump = (e: React.FormEvent) => {
    e.preventDefault();
    let n = parseInt(jump.replace(/\s/g, ""), 10);
    if (!Number.isFinite(n)) return;
    n = Math.min(Math.max(1, n), totalPages);
    go(n);
  };

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="mt-4 flex flex-col gap-4 border-t border-gray-100 pt-4">
      <p className="text-sm text-gray-600">
        {total === 0 ? (
          "No events in this period."
        ) : (
          <>
            Showing <span className="font-medium text-gray-900">{from}</span>
            {"–"}
            <span className="font-medium text-gray-900">{to}</span> of{" "}
            <span className="font-medium text-gray-900">
              {total.toLocaleString()}
            </span>{" "}
            events · page{" "}
            <span className="font-medium text-gray-900">{page}</span> of{" "}
            <span className="font-medium text-gray-900">{totalPages}</span>
          </>
        )}
      </p>

      {totalPages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
          <div className="flex flex-wrap items-center gap-1">
            <PagerBtn
              label="« First"
              onClick={() => go(1)}
              disabled={page <= 1}
            />
            <PagerBtn
              label="‹ Prev"
              onClick={() => go(page - 1)}
              disabled={page <= 1}
            />
            <span className="mx-1 text-gray-300 hidden sm:inline">|</span>
            {model.map((item, i) =>
              item === "ellipsis" ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-2 text-gray-400 select-none"
                  aria-hidden
                >
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => go(item)}
                  className={`min-w-[2.25rem] px-2 py-1 text-sm rounded border transition-colors ${
                    page === item
                      ? "border-gray-900 bg-gray-900 text-white font-medium"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item}
                </button>
              )
            )}
            <span className="mx-1 text-gray-300 hidden sm:inline">|</span>
            <PagerBtn
              label="Next ›"
              onClick={() => go(page + 1)}
              disabled={page >= totalPages}
            />
            <PagerBtn
              label="Last »"
              onClick={() => go(totalPages)}
              disabled={page >= totalPages}
            />
          </div>

          <form
            onSubmit={onJump}
            className="flex flex-wrap items-center gap-2 sm:ml-auto"
          >
            <label htmlFor="admin-epage-jump" className="text-sm text-gray-600">
              Go to page
            </label>
            <input
              id="admin-epage-jump"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              value={jump}
              onChange={(e) => setJump(e.target.value)}
              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              aria-label="Page number"
            />
            <span className="text-sm text-gray-500">
              (1–{totalPages})
            </span>
            <button
              type="submit"
              className="px-3 py-1 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Go
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function PagerBtn({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="px-2 py-1 text-sm rounded border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
    >
      {label}
    </button>
  );
}
