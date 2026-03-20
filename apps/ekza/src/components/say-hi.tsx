"use client";

import { useEffect } from "react";

export function SayHi() {
  useEffect(() => {
    const isProduction = process.env.NODE_ENV === "production";
    if (isProduction) {
      fetch("/hi", { method: "GET" });
    }
  }, []);
  return null;
}
