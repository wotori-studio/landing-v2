"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "./track";

/**
 * AnalyticsTracker component
 * 
 * Invisible client component that automatically tracks page views.
 * - Tracks on mount and when pathname changes
 * - Uses window.location.hostname as domain
 * - Passes current pathname to tracking function
 * - Runs asynchronously in background, doesn't block rendering
 */
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Get domain from window (works in browser only)
    if (typeof window === "undefined") {
      return;
    }

    const domain = window.location.hostname;
    const path = pathname || "/";

    // Track event asynchronously (non-blocking)
    // Server Action will handle the actual tracking
    trackEvent(domain, path).catch((error) => {
      // Silently handle errors to not break the site
      console.error("[Analytics] Failed to track page view:", error);
    });
  }, [pathname]);

  // This component is invisible (renders nothing)
  return null;
}
