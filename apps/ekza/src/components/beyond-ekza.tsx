"use client";

import React from "react";
import { useI18n } from "../lib/i18n-provider";
import { Reveal } from "./motion";

export function BeyondEkza() {
  const { t } = useI18n();

  const points = [
    t("ekza.v2.protocol.beyond.point1"),
    t("ekza.v2.protocol.beyond.point2"),
    t("ekza.v2.protocol.beyond.point3"),
  ];

  return (
    <section
      id="beyond-ekza"
      className="border-t border-ekza-border/15 bg-ekza-muted py-20 dark:border-white/5 dark:bg-[#111417] md:py-28"
    >
      <div className="container mx-auto px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90">
            {t("ekza.v2.protocol.beyond.eyebrow")}
          </p>
          <h2 className="font-headline text-4xl font-bold tracking-tight text-ekza-on dark:text-white md:text-5xl">
            {t("ekza.v2.protocol.beyond.headline")}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-light text-ekza-on-muted dark:text-white/70">
            {t("ekza.v2.protocol.beyond.body")}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {points.map((point, index) => (
            <Reveal
              key={point}
              delay={index * 80}
              as="article"
              className="rounded-2xl border border-ekza-border/25 bg-ekza-elevated/95 p-6 text-center shadow-ekza-card dark:border-white/10 dark:bg-white/[0.05] dark:shadow-ekza-card-dark"
            >
              <p className="text-sm font-medium leading-relaxed text-ekza-on dark:text-white/90">
                {point}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BeyondEkza;
