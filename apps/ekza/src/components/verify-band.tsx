"use client";

import React from "react";
import { useI18n } from "../lib/i18n-provider";
import { Reveal } from "./motion";

export function VerifyBand() {
  const { t } = useI18n();

  const chips = [
    t("ekza.v2.dev.verify.chip1"),
    t("ekza.v2.dev.verify.chip2"),
    t("ekza.v2.dev.verify.chip3"),
  ];

  return (
    <section
      id="verify"
      className="border-t border-ekza-border/15 bg-ekza-muted py-20 dark:border-white/5 dark:bg-[#111417] md:py-28"
    >
      <div className="container mx-auto px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90">
            {t("ekza.v2.dev.verify.eyebrow")}
          </p>
          <h2 className="font-headline text-4xl font-bold tracking-tight text-ekza-on dark:text-white md:text-5xl">
            {t("ekza.v2.dev.verify.headline")}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-light text-ekza-on-muted dark:text-white/70">
            {t("ekza.v2.dev.verify.body")}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-ekza-border/30 bg-ekza-elevated/90 px-4 py-1.5 font-mono text-xs text-ekza-primary dark:border-white/10 dark:bg-white/[0.05] dark:text-cyan-300/90"
              >
                {chip}
              </span>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-ekza-on-muted dark:text-white/55">
            {t("ekza.v2.dev.verify.note")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default VerifyBand;
