"use client";

import React from "react";
import { useI18n } from "../lib/i18n-provider";
import { Reveal } from "./motion";

const PROGRAM_ID = "2WtuXG6AX3erRp6eK5WiSTEEBec5zprQ7qLyLENfMQEH";
const EXPLORER_URL = `https://explorer.solana.com/address/${PROGRAM_ID}?cluster=devnet`;

interface CredibilityBandProps {
  // Home uses the dedicated Roadmap component, so hide the inline roadmap here.
  showRoadmap?: boolean;
}

export function CredibilityBand({ showRoadmap = true }: CredibilityBandProps = {}) {
  const { t } = useI18n();

  const cards = [
    {
      title: t("ekza.v2.credibility.openSource.title"),
      body: t("ekza.v2.credibility.openSource.body"),
      link: t("ekza.v2.credibility.openSource.link"),
      href: "https://github.com/ekza-space",
    },
    {
      title: t("ekza.v2.credibility.onChain.title"),
      body: t("ekza.v2.credibility.onChain.body"),
      link: t("ekza.v2.credibility.onChain.link"),
      href: EXPLORER_URL,
    },
    {
      title: t("ekza.v2.credibility.builtInOpen.title"),
      body: t("ekza.v2.credibility.builtInOpen.body"),
      link: t("ekza.v2.credibility.builtInOpen.link"),
      href: "https://wotori.io",
    },
  ];

  const roadmap = [
    {
      title: t("ekza.v2.credibility.roadmap.now.title"),
      body: t("ekza.v2.credibility.roadmap.now.body"),
      active: true,
    },
    {
      title: t("ekza.v2.credibility.roadmap.next.title"),
      body: t("ekza.v2.credibility.roadmap.next.body"),
      active: false,
    },
    {
      title: t("ekza.v2.credibility.roadmap.later.title"),
      body: t("ekza.v2.credibility.roadmap.later.body"),
      active: false,
    },
  ];

  return (
    <section
      id="credibility"
      className="border-t border-ekza-border/15 bg-ekza-muted py-20 dark:border-white/5 dark:bg-[#111417] md:py-28"
    >
      <div className="container mx-auto px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90">
            {t("ekza.v2.credibility.eyebrow")}
          </p>
          <h2 className="font-headline text-4xl font-bold tracking-tight text-ekza-on dark:text-white md:text-5xl">
            {t("ekza.v2.credibility.headline")}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-light text-ekza-on-muted dark:text-white/70">
            {t("ekza.v2.credibility.subcopy")}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {cards.map((card, index) => (
            <Reveal
              key={card.title}
              delay={index * 80}
              as="article"
              className="flex flex-col rounded-2xl border border-ekza-border/25 bg-ekza-elevated/95 p-7 shadow-ekza-card transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/[0.05] dark:shadow-ekza-card-dark"
            >
              <h3 className="font-headline text-xl font-semibold text-ekza-on dark:text-white">
                {card.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ekza-on-muted dark:text-white/75">
                {card.body}
              </p>
              <a
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link mt-5 inline-flex items-center gap-1 text-sm font-medium"
              >
                {card.link}
                <span aria-hidden>→</span>
              </a>
            </Reveal>
          ))}
        </div>

        {/* Single roadmap signal (consolidates the repeated status pills) */}
        {showRoadmap && (
        <>
        <Reveal className="mx-auto mt-12 max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-amber-400/50 bg-amber-100/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-amber-950 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-100">
            {t("ekza.v2.credibility.statusRibbon")}
          </span>
        </Reveal>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {roadmap.map((phase, index) => (
            <Reveal
              key={phase.title}
              delay={index * 80}
              as="article"
              className={`rounded-2xl border p-6 ${
                phase.active
                  ? "border-ekza-primary/40 bg-ekza-primary-muted/40 dark:border-cyan-500/40 dark:bg-cyan-950/20"
                  : "border-ekza-border/25 bg-ekza-elevated/70 dark:border-white/10 dark:bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    phase.active
                      ? "bg-emerald-500 dark:bg-emerald-400"
                      : "bg-ekza-on-muted/40 dark:bg-white/30"
                  }`}
                  aria-hidden
                />
                <span className="font-headline text-xs font-semibold uppercase tracking-[0.25em] text-ekza-primary dark:text-cyan-300/90">
                  {phase.title}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ekza-on-muted dark:text-white/75">
                {phase.body}
              </p>
            </Reveal>
          ))}
        </div>
        </>
        )}
      </div>
    </section>
  );
}

export default CredibilityBand;
