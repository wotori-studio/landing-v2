"use client";

import React from "react";
import { useI18n } from "../lib/i18n-provider";
import { Reveal } from "./motion";

export function FounderBand() {
  const { t } = useI18n();

  return (
    <section
      id="founder"
      className="border-t border-ekza-border/15 bg-ekza-bg py-16 dark:border-white/5 dark:bg-[#0c0f12] md:py-20"
    >
      <div className="container mx-auto px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-10">
          <Reveal className="w-40 shrink-0 sm:w-44">
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

          <Reveal className="text-center sm:text-left">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90">
              {t("ekza.v2.founder.eyebrow")}
            </p>
            <h2 className="font-headline text-xl font-semibold text-ekza-on dark:text-white">
              {t("ekza.v2.founder.name")}
            </h2>
            <p className="mt-1 text-sm font-medium text-ekza-on-muted dark:text-white/60">
              {t("ekza.v2.founder.role")}
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ekza-on-muted dark:text-white/70">
              {t("ekza.v2.founder.bio")}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-start">
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
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default FounderBand;
