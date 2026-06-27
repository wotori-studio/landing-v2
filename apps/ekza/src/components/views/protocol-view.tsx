"use client";

import React from "react";
import { HeroSection } from "../hero-section";
import { HowItWorksSteps } from "../how-it-works-steps";
import { WhatIsSpace } from "../what-is-space";
import { PrimitiveGrid } from "../primitive-grid";
import { ArenaSection } from "../arena-section";
import { BeyondEkza } from "../beyond-ekza";
import { FinalCta } from "../final-cta";
import { Reveal } from "../motion";
import { useI18n } from "../../lib/i18n-provider";
import { useReserve } from "../../app/reserve-provider";

export function ProtocolView() {
  const { t } = useI18n();
  const { openReserve } = useReserve();

  const heroButtons = [
    {
      text: t("ekza.v2.protocol.hero.btnReserve"),
      onClick: openReserve,
      variant: "primary" as const,
    },
    {
      text: t("ekza.v2.protocol.hero.btnPrograms"),
      link: "/developers",
      variant: "secondary" as const,
    },
  ];

  const creationSteps = [
    {
      title: t("ekza.v2.protocol.creationFlow.step1.title"),
      body: t("ekza.v2.protocol.creationFlow.step1.body"),
    },
    {
      title: t("ekza.v2.protocol.creationFlow.step2.title"),
      body: t("ekza.v2.protocol.creationFlow.step2.body"),
    },
    {
      title: t("ekza.v2.protocol.creationFlow.step3.title"),
      body: t("ekza.v2.protocol.creationFlow.step3.body"),
    },
    {
      title: t("ekza.v2.protocol.creationFlow.step4.title"),
      body: t("ekza.v2.protocol.creationFlow.step4.body"),
    },
    {
      title: t("ekza.v2.protocol.creationFlow.step5.title"),
      body: t("ekza.v2.protocol.creationFlow.step5.body"),
    },
  ];

  return (
    <main className="font-ekza text-ekza-on">
      <HeroSection
        imageUrl="/img/stellar.jpg"
        imageAlt="Stellar — the protocol of collective creation"
        quoteEyebrow={t("ekza.v2.protocol.hero.eyebrow")}
        title={t("ekza.v2.protocol.hero.headline")}
        subtitle={t("ekza.v2.protocol.hero.subhead")}
        buttons={heroButtons}
        heroHeight="min-h-[78vh]"
        footerLeft={t("ekza.v2.protocol.hero.footerLeft")}
        footerCenter={t("ekza.v2.protocol.hero.footerCenter")}
      />

      {/* Thesis */}
      <section
        id="thesis"
        className="border-t border-ekza-border/20 bg-ekza-surface py-20 dark:border-white/10 dark:bg-[#0c0e12] md:py-28"
      >
        <div className="container mx-auto px-6">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90">
              {t("ekza.v2.protocol.thesis.eyebrow")}
            </p>
            <h2 className="font-headline text-3xl font-bold leading-tight tracking-tight text-ekza-on dark:text-white md:text-4xl">
              {t("ekza.v2.protocol.thesis.headline")}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-ekza-on-muted dark:text-white/70">
              {t("ekza.v2.protocol.thesis.body")}
            </p>
          </Reveal>
          <Reveal
            as="blockquote"
            delay={80}
            className="mx-auto mt-10 max-w-2xl border-l-2 border-ekza-primary/50 py-1 pl-5 text-lg italic leading-relaxed text-ekza-on-muted dark:border-cyan-400/50 dark:text-white/80"
          >
            {t("ekza.v2.protocol.thesis.quote")}
          </Reveal>
        </div>
      </section>

      <HowItWorksSteps
        id="creation-flow"
        eyebrow={t("ekza.v2.protocol.creationFlow.eyebrow")}
        headline={t("ekza.v2.protocol.creationFlow.headline")}
        steps={creationSteps}
      />

      {/* Space primitive deep */}
      <section
        id="space-deep"
        className="border-t border-ekza-border/20 bg-ekza-surface pt-20 dark:border-white/10 dark:bg-[#0c0e12] md:pt-28"
      >
        <div className="container mx-auto px-6">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90">
              {t("ekza.v2.protocol.spaceDeep.eyebrow")}
            </p>
            <h2 className="font-headline text-4xl font-bold tracking-tight text-ekza-on dark:text-white md:text-5xl">
              {t("ekza.v2.protocol.spaceDeep.headline")}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg font-light text-ekza-on-muted dark:text-white/70">
              {t("ekza.v2.protocol.spaceDeep.subcopy")}
            </p>
          </Reveal>
        </div>
      </section>

      <WhatIsSpace />
      <HowItWorksSteps />
      <PrimitiveGrid />

      <ArenaSection />

      <BeyondEkza />

      <FinalCta
        headline={t("ekza.v2.protocol.cta.headline")}
        subcopy={t("ekza.v2.protocol.cta.subcopy")}
        primaryLabel={t("ekza.v2.protocol.cta.primary")}
        onPrimary={openReserve}
        secondary={[
          { label: `${t("ekza.v2.protocol.cta.secondary")} →`, href: "/developers" },
        ]}
        showNewsletter={false}
      />
    </main>
  );
}

export default ProtocolView;
