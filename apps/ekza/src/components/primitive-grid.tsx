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

const Icons = {
  finite: (
    <svg {...iconProps}>
      <path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-4Z" />
      <path d="M9 12h6" />
    </svg>
  ),
  ownership: (
    <svg {...iconProps}>
      <circle cx="8" cy="15" r="4" />
      <path d="m10.85 12.15 6.15-6.15M16 5h3v3M14 8l2 2" />
    </svg>
  ),
  configurable: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.6 1.36V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-2.6-1.36l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0-1.36-2.6H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.36-2.6l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 2.6-1.36V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 2.6 1.36l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0 1.36 2.6H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  ),
  collaboration: (
    <svg {...iconProps}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  portable: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </svg>
  ),
  events: (
    <svg {...iconProps}>
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
    </svg>
  ),
};

interface PrimitiveGridProps {
  // "teaser" renders only the three strongest cards for the home page.
  variant?: "full" | "teaser";
  id?: string;
  eyebrow?: string;
  headline?: string;
  subcopy?: string;
  linkLabel?: string;
  linkHref?: string;
}

export function PrimitiveGrid({
  variant = "full",
  id = "primitives",
  eyebrow,
  headline,
  subcopy,
  linkLabel,
  linkHref,
}: PrimitiveGridProps = {}) {
  const { t } = useI18n();

  const allCards: { icon: React.ReactNode; title: string; body: string }[] = [
    {
      icon: Icons.finite,
      title: t("ekza.v2.primitives.finite.title"),
      body: t("ekza.v2.primitives.finite.body"),
    },
    {
      icon: Icons.ownership,
      title: t("ekza.v2.primitives.ownership.title"),
      body: t("ekza.v2.primitives.ownership.body"),
    },
    {
      icon: Icons.configurable,
      title: t("ekza.v2.primitives.configurable.title"),
      body: t("ekza.v2.primitives.configurable.body"),
    },
    {
      icon: Icons.collaboration,
      title: t("ekza.v2.primitives.collaboration.title"),
      body: t("ekza.v2.primitives.collaboration.body"),
    },
    {
      icon: Icons.portable,
      title: t("ekza.v2.primitives.portable.title"),
      body: t("ekza.v2.primitives.portable.body"),
    },
    {
      icon: Icons.events,
      title: t("ekza.v2.primitives.events.title"),
      body: t("ekza.v2.primitives.events.body"),
    },
  ];

  // Teaser keeps the three strongest cards for buyers: ownership, configurable, finite.
  // It uses home-scoped copy (rail-neutral); the full grid keeps protocol-accurate wording.
  const teaserCards: { icon: React.ReactNode; title: string; body: string }[] =
    (["ownership", "configurable", "finite"] as const).map((key) => ({
      icon: Icons[key],
      title: t(`ekza.v2.home.whyOwn.cards.${key}.title`),
      body: t(`ekza.v2.home.whyOwn.cards.${key}.body`),
    }));

  const cards = variant === "teaser" ? teaserCards : allCards;

  const resolvedEyebrow = eyebrow ?? t("ekza.v2.primitives.eyebrow");
  const resolvedHeadline = headline ?? t("ekza.v2.primitives.headline");

  return (
    <section
      id={id}
      className="border-t border-ekza-border/20 bg-ekza-surface py-20 dark:border-white/10 dark:bg-[#0c0e12] md:py-28"
    >
      <div className="container mx-auto px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90">
            {resolvedEyebrow}
          </p>
          <h2 className="font-headline text-4xl font-bold tracking-tight text-ekza-on dark:text-white md:text-5xl">
            {resolvedHeadline}
          </h2>
          {subcopy && (
            <p className="mx-auto mt-5 max-w-2xl text-lg font-light text-ekza-on-muted dark:text-white/70">
              {subcopy}
            </p>
          )}
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <Reveal
              key={card.title}
              delay={(index % 3) * 80}
              as="article"
              className="group rounded-2xl border border-ekza-border/25 bg-ekza-elevated/95 p-7 shadow-ekza-card transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/[0.05] dark:shadow-ekza-card-dark"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ekza-primary/15 bg-ekza-primary-muted text-ekza-primary dark:border-cyan-400/20 dark:bg-cyan-950/40 dark:text-cyan-300">
                {card.icon}
              </span>
              <h3 className="mt-5 font-headline text-xl font-semibold text-ekza-on dark:text-white">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ekza-on-muted dark:text-white/75">
                {card.body}
              </p>
            </Reveal>
          ))}
        </div>

        {linkLabel && linkHref && (
          <Reveal className="mt-12 text-center">
            <a href={linkHref} className="link inline-flex items-center gap-1 font-medium">
              {linkLabel}
              <span aria-hidden>→</span>
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export default PrimitiveGrid;
