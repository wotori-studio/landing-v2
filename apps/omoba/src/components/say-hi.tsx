"use client";

import { useEffect } from "react";

/**
 * Production ping — same pattern as wotori / ekza (`GET /hi`).
 */
export function SayHi() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      fetch("/hi", { method: "GET" }).catch(() => {});
    }
  }, []);
  return null;
}
