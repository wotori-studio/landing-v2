"use client";

import React from "react";
import { useI18n } from "../lib/i18n-provider";
import { Reveal } from "./motion";

interface Step {
  title: string;
  body: string;
}

interface HowItWorksStepsProps {
  id?: string;
  eyebrow?: string;
  headline?: string;
  steps?: Step[];
}

export function HowItWorksSteps({
  id = "how-it-works",
  eyebrow,
  headline,
  steps,
}: HowItWorksStepsProps = {}) {
  const { t } = useI18n();

  const resolvedSteps =
    steps ?? [
      {
        title: t("ekza.v2.howItWorks.step1.title"),
        body: t("ekza.v2.howItWorks.step1.body"),
      },
      {
        title: t("ekza.v2.howItWorks.step2.title"),
        body: t("ekza.v2.howItWorks.step2.body"),
      },
      {
        title: t("ekza.v2.howItWorks.step3.title"),
        body: t("ekza.v2.howItWorks.step3.body"),
      },
    ];

  const resolvedEyebrow = eyebrow ?? t("ekza.v2.howItWorks.eyebrow");
  const resolvedHeadline = headline ?? t("ekza.v2.howItWorks.headline");
  const gridCols =
    resolvedSteps.length >= 5
      ? "md:grid-cols-2 lg:grid-cols-5"
      : "md:grid-cols-3";

  return (
    <section
      id={id}
      className="border-t border-ekza-border/15 bg-ekza-muted py-20 dark:border-white/5 dark:bg-[#111417] md:py-28"
    >
      <div className="container mx-auto px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90">
            {resolvedEyebrow}
          </p>
          <h2 className="font-headline text-4xl font-bold tracking-tight text-ekza-on dark:text-white md:text-5xl">
            {resolvedHeadline}
          </h2>
        </Reveal>

        <div className={`mt-14 grid gap-6 ${gridCols}`}>
          {resolvedSteps.map((step, index) => (
            <Reveal
              key={step.title}
              delay={index * 90}
              as="article"
              className="group relative rounded-2xl border border-ekza-border/25 bg-ekza-elevated/95 p-7 shadow-ekza-card transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/[0.05] dark:shadow-ekza-card-dark"
            >
              <span className="font-headline text-5xl font-bold leading-none text-ekza-primary/45 dark:text-cyan-300/45">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-headline text-xl font-semibold text-ekza-on dark:text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ekza-on-muted dark:text-white/75">
                {step.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSteps;
