"use client";

import React from "react";
import { useI18n } from "../lib/i18n-provider";
import { Reveal } from "./motion";

export function Roadmap() {
  const { t } = useI18n();

  const stages = [
    {
      key: "now",
      badge: t("ekza.v2.home.roadmap.now.badge"),
      title: t("ekza.v2.home.roadmap.now.title"),
      body: t("ekza.v2.home.roadmap.now.body"),
      active: true,
    },
    {
      key: "next",
      badge: t("ekza.v2.home.roadmap.next.badge"),
      title: t("ekza.v2.home.roadmap.next.title"),
      body: t("ekza.v2.home.roadmap.next.body"),
      active: false,
    },
    {
      key: "later",
      badge: t("ekza.v2.home.roadmap.later.badge"),
      title: t("ekza.v2.home.roadmap.later.title"),
      body: t("ekza.v2.home.roadmap.later.body"),
      active: false,
    },
  ];

  return (
    <section
      id="roadmap"
      className="border-t border-ekza-border/20 bg-ekza-surface py-20 dark:border-white/10 dark:bg-[#0c0e12] md:py-28"
    >
      <div className="container mx-auto px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90">
            {t("ekza.v2.home.roadmap.eyebrow")}
          </p>
          <h2 className="font-headline text-4xl font-bold tracking-tight text-ekza-on dark:text-white md:text-5xl">
            {t("ekza.v2.home.roadmap.headline")}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {stages.map((stage, index) => (
            <Reveal
              key={stage.key}
              delay={index * 90}
              as="article"
              className={`relative flex flex-col rounded-2xl border p-7 ${
                stage.active
                  ? "border-ekza-primary/40 bg-ekza-primary-muted/40 dark:border-cyan-500/40 dark:bg-cyan-950/20"
                  : "border-ekza-border/25 bg-ekza-elevated/70 dark:border-white/10 dark:bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    stage.active
                      ? "bg-emerald-500 dark:bg-emerald-400"
                      : "bg-ekza-on-muted/40 dark:bg-white/30"
                  }`}
                  aria-hidden
                />
                <span className="font-headline text-xs font-semibold uppercase tracking-[0.25em] text-ekza-primary dark:text-cyan-300/90">
                  {stage.badge}
                </span>
              </div>
              <h3 className="mt-5 font-headline text-2xl font-bold text-ekza-on dark:text-white">
                {stage.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ekza-on-muted dark:text-white/75">
                {stage.body}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-10 max-w-3xl text-center">
          <p className="text-sm leading-relaxed text-ekza-on-muted dark:text-white/60">
            {t("ekza.v2.home.roadmap.footnote")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default Roadmap;
