"use client";

import React from "react";
import { useI18n } from "../lib/i18n-provider";
import { Marquee } from "./motion";

export function FactStrip({
  itemsKey = "ekza.v2.factStrip.items",
}: { itemsKey?: string } = {}) {
  const { t } = useI18n();
  const items = t(itemsKey)
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="border-y border-ekza-border/25 bg-ekza-muted text-ekza-on dark:border-white/10 dark:bg-[#0c0e12] dark:text-white">
      <Marquee items={items} />
    </div>
  );
}

export default FactStrip;
