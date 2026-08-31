"use client";

import React from "react";
import { useI18n } from "../lib/i18n-provider";
import { Reveal } from "./motion";

export function FounderBand() {
  const { t } = useI18n();

  const facts = [1, 2, 3, 4].map((n) => t(`ekza.v2.founder.facts.f${n}`));

  return (
    <section
      id="founder"
      className="border-t border-ekza-border/15 bg-ekza-bg py-20 dark:border-white/5 dark:bg-[#0c0f12] md:py-28"
    >
      <div className="container mx-auto px-6">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[minmax(0,320px)_1fr] md:gap-14">
          <Reveal className="relative mx-auto w-full max-w-[320px]">
            <div className="overflow-hidden rounded-2xl border border-ekza-border/25 shadow-ekza-card dark:border-white/10 dark:shadow-ekza-card-dark">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/founder.jpg"
                alt={t("ekza.v2.founder.name")}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90">
                {t("ekza.v2.founder.eyebrow")}
              </p>
              <h2 className="font-headline text-3xl font-bold tracking-tight text-ekza-on dark:text-white md:text-4xl">
                {t("ekza.v2.founder.headline")}
              </h2>
              <p className="mt-2 font-headline text-lg font-semibold text-ekza-on dark:text-white/90">
                {t("ekza.v2.founder.name")}
                <span className="mx-2 text-ekza-on-muted/60 dark:text-white/40">·</span>
                <span className="font-medium text-ekza-primary dark:text-cyan-300/90">
                  {t("ekza.v2.founder.role")}
                </span>
              </p>
              <p className="mt-5 max-w-2xl text-lg font-light leading-relaxed text-ekza-on-muted dark:text-white/70">
                {t("ekza.v2.founder.bio")}
              </p>
            </Reveal>

            <Reveal delay={120}>
              <ul className="mt-7 flex flex-wrap gap-2.5">
                {facts.map((fact) => (
                  <li
                    key={fact}
                    className="rounded-full border border-ekza-border/25 bg-ekza-elevated/95 px-4 py-1.5 text-sm text-ekza-on-muted dark:border-white/10 dark:bg-white/[0.05] dark:text-white/75"
                  >
                    {fact}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
                <a
                  href="https://wotori.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link inline-flex items-center gap-1 text-sm font-medium"
                >
                  {t("ekza.v2.founder.studioLink")}
                  <span aria-hidden>→</span>
                </a>
                <a
                  href="https://twitter.com/wotorimovako"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link inline-flex items-center gap-1 text-sm font-medium"
                >
                  X / Twitter
                  <span aria-hidden>→</span>
                </a>
                <a
                  href="https://t.me/wotoristudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link inline-flex items-center gap-1 text-sm font-medium"
                >
                  Telegram
                  <span aria-hidden>→</span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FounderBand;
