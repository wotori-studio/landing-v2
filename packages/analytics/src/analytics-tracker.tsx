"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "./track";

const STORAGE_KEY = "repo_analytics_vid";

function getOrCreateVisitorKey(): string {
  if (typeof window === "undefined") return "";
  try {
    let k = localStorage.getItem(STORAGE_KEY);
    if (!k || k.length < 16) {
      k =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `v_${Date.now()}_${Math.random().toString(36).slice(2, 18)}`;
      localStorage.setItem(STORAGE_KEY, k);
    }
    return k;
  } catch {
    return `ephemeral_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }
}

/** Visitor's local calendar date YYYY-MM-DD (stable "day" for hashing) */
function getClientLocalDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const domain = window.location.hostname;
    const path = pathname || "/";
    const visitorKey = getOrCreateVisitorKey();
    const clientLocalDate = getClientLocalDate();

    if (!visitorKey) return;

    trackEvent(domain, path, visitorKey, clientLocalDate).catch((error) => {
      console.error("[Analytics] Failed to track page view:", error);
    });
  }, [pathname]);

  return null;
}
