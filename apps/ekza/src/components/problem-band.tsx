"use client";

import React from "react";
import { useI18n } from "../lib/i18n-provider";
import { Reveal } from "./motion";

const iconProps = {
  className: "h-6 w-6",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const ICONS = [
  // no portable ownership — unlinked
  <svg key="a" {...iconProps}>
    <path d="M9.5 9.5 7 12a4 4 0 0 0 5 5l1-1M14.5 14.5 17 12a4 4 0 0 0-5-5l-1 1" />
    <path d="m4 4 16 16" />
  </svg>,
  // frozen — snowflake/lock
  <svg key="b" {...iconProps}>
    <rect x="4" y="11" width="16" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>,
  // not enterable — blocked door
  <svg key="c" {...iconProps}>
    <path d="M3 21h18M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
    <circle cx="12" cy="12" r="6" className="opacity-0" />
    <path d="m9 10 6 6M15 10l-6 6" />
  </svg>,
];

export function ProblemBand() {
  const { t } = useI18n();

  const beats = [
    {
      title: t("ekza.v2.problem.beats.ownership.title"),
      body: t("ekza.v2.problem.beats.ownership.body"),
    },
    {
      title: t("ekza.v2.problem.beats.frozen.title"),
      body: t("ekza.v2.problem.beats.frozen.body"),
    },
    {
      title: t("ekza.v2.problem.beats.entered.title"),
      body: t("ekza.v2.problem.beats.entered.body"),
    },
  ];

  return (
    <section
      id="problem"
      className="border-t border-ekza-border/20 bg-ekza-surface py-20 dark:border-white/10 dark:bg-[#0c0e12] md:py-28"
    >
      <div className="container mx-auto px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90">
            {t("ekza.v2.problem.eyebrow")}
          </p>
          <h2 className="font-headline text-4xl font-bold tracking-tight text-ekza-on dark:text-white md:text-5xl">
            {t("ekza.v2.problem.headline")}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-light text-ekza-on-muted dark:text-white/70">
            {t("ekza.v2.problem.subcopy")}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {beats.map((beat, index) => (
            <Reveal
              key={beat.title}
              delay={index * 90}
              as="article"
              className="rounded-2xl border border-ekza-border/25 bg-ekza-elevated/95 p-7 shadow-ekza-card transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/[0.05] dark:shadow-ekza-card-dark"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ekza-primary-muted text-ekza-primary dark:bg-cyan-950/40 dark:text-cyan-300">
                {ICONS[index]}
              </span>
              <h3 className="mt-5 font-headline text-xl font-semibold text-ekza-on dark:text-white">
                {beat.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ekza-on-muted dark:text-white/75">
                {beat.body}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <p className="text-lg font-medium text-ekza-on dark:text-white">
            {t("ekza.v2.problem.transition")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default ProblemBand;
