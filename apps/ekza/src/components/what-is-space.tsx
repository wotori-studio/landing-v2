"use client";

import React from "react";
import { useI18n } from "../lib/i18n-provider";
import { Reveal } from "./motion";
import { SpaceCardVisual } from "./space-card-visual";

const FIELD_CHIPS = [
  "space_id",
  "mint",
  "owner",
  "name",
  "space_config_uri",
  "is_open",
  "is_editable_by_others",
  "editors[ ]",
];

export function WhatIsSpace() {
  const { t } = useI18n();

  return (
    <section
      id="what-is-a-space"
      className="border-t border-ekza-border/20 bg-ekza-surface py-20 dark:border-white/10 dark:bg-[#0c0e12] md:py-28"
    >
      <div className="container mx-auto px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90">
            {t("ekza.v2.whatIsSpace.eyebrow")}
          </p>
          <h2 className="font-headline text-4xl font-bold tracking-tight text-ekza-on dark:text-white md:text-5xl">
            {t("ekza.v2.whatIsSpace.headline")}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-light text-ekza-on-muted dark:text-white/70">
            {t("ekza.v2.whatIsSpace.subcopy")}
          </p>
        </Reveal>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal className="space-y-5">
            <article className="rounded-2xl border border-ekza-border/25 bg-ekza-elevated/95 p-7 shadow-ekza-card transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/[0.05] dark:shadow-ekza-card-dark">
              <h3 className="font-headline text-xl font-semibold text-ekza-on dark:text-white">
                {t("ekza.v2.whatIsSpace.nft.title")}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ekza-on-muted dark:text-white/75">
                {t("ekza.v2.whatIsSpace.nft.body")}
              </p>
            </article>
            <article className="rounded-2xl border border-ekza-border/25 bg-ekza-elevated/95 p-7 shadow-ekza-card transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/[0.05] dark:shadow-ekza-card-dark">
              <h3 className="font-headline text-xl font-semibold text-ekza-on dark:text-white">
                {t("ekza.v2.whatIsSpace.pda.title")}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ekza-on-muted dark:text-white/75">
                {t("ekza.v2.whatIsSpace.pda.body")}
              </p>
            </article>

            <div>
              <p className="mb-3 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-ekza-on-muted dark:text-white/45">
                {t("ekza.v2.whatIsSpace.fieldsLabel")}
              </p>
              <div className="flex flex-wrap gap-2">
                {FIELD_CHIPS.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-md border border-ekza-border/25 bg-ekza-muted/70 px-2.5 py-1 font-mono text-xs text-ekza-primary dark:border-white/10 dark:bg-white/[0.05] dark:text-cyan-300/90"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <SpaceCardVisual
              id={42}
              total={1000}
              name="Studio Arena"
              owner="studio.sol"
              mint="3kZt…W9vL"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default WhatIsSpace;
