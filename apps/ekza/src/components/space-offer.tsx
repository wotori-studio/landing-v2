"use client";

import React from "react";
import { useI18n } from "../lib/i18n-provider";
import { Reveal } from "./motion";
import { SpaceCardVisual } from "./space-card-visual";
import { useReserve } from "../app/reserve-provider";

export function SpaceOffer() {
  const { t } = useI18n();
  const { openReserve } = useReserve();

  const bullets = [
    t("ekza.v2.home.spaceOffer.bullet1"),
    t("ekza.v2.home.spaceOffer.bullet2"),
    t("ekza.v2.home.spaceOffer.bullet3"),
  ];

  return (
    <section
      id="space-offer"
      className="relative overflow-hidden border-t border-ekza-border/20 bg-ekza-surface py-20 dark:border-white/10 dark:bg-[#0c0e12] md:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-100"
        aria-hidden
      >
        <div className="ekza-glow-orb -left-40 top-0 h-[420px] w-[420px] bg-ekza-primary/70 dark:bg-cyan-400" />
        <div className="ekza-glow-orb -right-40 bottom-0 h-[420px] w-[420px] bg-ekza-accent/60 dark:bg-purple-600" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90">
              {t("ekza.v2.home.spaceOffer.eyebrow")}
            </p>
            <h2 className="font-headline text-4xl font-bold tracking-tight text-ekza-on dark:text-white md:text-5xl">
              {t("ekza.v2.home.spaceOffer.headline")}
            </h2>
            <p className="mt-5 text-lg font-light text-ekza-on-muted dark:text-white/70">
              {t("ekza.v2.home.spaceOffer.subcopy")}
            </p>

            <ul className="mt-8 space-y-4">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span
                    className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-ekza-primary-muted text-ekza-primary dark:bg-cyan-950/40 dark:text-cyan-300"
                    aria-hidden
                  >
                    <svg
                      className="h-3 w-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                  </span>
                  <span className="text-sm leading-relaxed text-ekza-on-muted dark:text-white/80">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-3">
              <button
                onClick={openReserve}
                className="inline-flex w-fit items-center justify-center rounded-full bg-ekza-primary px-8 py-3.5 text-sm font-semibold tracking-wide text-ekza-on-primary shadow-lg shadow-ekza-primary/25 transition hover:-translate-y-0.5 hover:shadow-ekza-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-ekza-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ekza-bg dark:bg-gradient-to-r dark:from-[#00d1ff] dark:to-[#7701d0] dark:text-[#003543] dark:shadow-[0_0_24px_rgba(0,209,255,0.35)] dark:focus-visible:ring-offset-black"
              >
                {t("ekza.v2.home.spaceOffer.cta")}
              </button>
              <p className="max-w-md text-xs leading-relaxed text-ekza-on-muted dark:text-white/55">
                {t("ekza.v2.home.spaceOffer.microcopy")}
              </p>
              <a
                href="#why-own"
                className="link inline-flex items-center gap-1 text-sm font-medium"
              >
                {t("ekza.v2.home.spaceOffer.secondary")}
                <span aria-hidden>→</span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <SpaceCardVisual
              id={1}
              total={1000}
              name="Genesis Hall"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default SpaceOffer;
