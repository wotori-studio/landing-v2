"use client";

import React from "react";
import { useI18n } from "../lib/i18n-provider";
import { Reveal } from "./motion";

export function ArenaSection() {
  const { t } = useI18n();

  const points = [
    {
      title: t("ekza.v2.arena.avatars.title"),
      body: t("ekza.v2.arena.avatars.body"),
    },
    {
      title: t("ekza.v2.arena.cards.title"),
      body: t("ekza.v2.arena.cards.body"),
    },
    {
      title: t("ekza.v2.arena.bridge.title"),
      body: t("ekza.v2.arena.bridge.body"),
    },
  ];

  return (
    <section
      id="arena"
      className="border-t border-ekza-border/15 bg-ekza-muted py-20 dark:border-white/5 dark:bg-[#111417] md:py-28"
    >
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <div className="relative">
              <div
                className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-ekza-primary/20 to-ekza-accent/30 opacity-60 blur-2xl dark:from-cyan-500/20 dark:to-purple-600/20"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-3xl border border-ekza-border/25 bg-ekza-card shadow-ekza-card dark:border-white/10 dark:shadow-ekza-card-dark">
                <img
                  src="/img/world-portal.jpg"
                  alt="Ekza Arena scene"
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
                  aria-hidden
                />
              </div>
            </div>
          </Reveal>

          <Reveal className="order-1 lg:order-2" delay={80}>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90">
              {t("ekza.v2.arena.eyebrow")}
            </p>
            <h2 className="font-headline text-4xl font-bold tracking-tight text-ekza-on dark:text-white md:text-5xl">
              {t("ekza.v2.arena.headline")}
            </h2>
            <p className="mt-5 text-lg font-light text-ekza-on-muted dark:text-white/70">
              {t("ekza.v2.arena.subcopy")}
            </p>

            <dl className="mt-8 space-y-5">
              {points.map((point) => (
                <div key={point.title}>
                  <dt className="font-headline text-base font-semibold text-ekza-on dark:text-white">
                    {point.title}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ekza-on-muted dark:text-white/75">
                    {point.body}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-8">
              <span className="inline-flex rounded-full border border-amber-400/50 bg-amber-100/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-amber-950 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-100">
                {t("ekza.v2.arena.statusNote")}
              </span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default ArenaSection;
