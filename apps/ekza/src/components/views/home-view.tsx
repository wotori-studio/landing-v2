"use client";

import React from "react";
import { HeroSection } from "../hero-section";
import { FactStrip } from "../fact-strip";
import { HowPiecesFit } from "../how-pieces-fit";
import { LiveWorldEmbed } from "../live-world-embed";
import { SpaceOffer } from "../space-offer";
import { PrimitiveGrid } from "../primitive-grid";
import { CredibilityBand } from "../credibility-band";
import { Roadmap } from "../roadmap";
import ProjectCards from "../project-cards";
import { PartnerSpotlight } from "../partner-spotlight";
import { FinalCta } from "../final-cta";
import { SpaceCardVisual } from "../space-card-visual";
import { Reveal } from "../motion";
import { useI18n } from "../../lib/i18n-provider";
import { useReserve } from "../../app/reserve-provider";

export function HomeView() {
  const { t } = useI18n();
  const { openReserve } = useReserve();

  const projects = [
    {
      projectName: "Stellar",
      imgPath:
        "https://ipfs.io/ipfs/Qmc7sh3DefV3YA7xgXAnC1GE8ncsoyChtY6fBEiFDWE2bB",
      imgPath2:
        "https://ipfs.io/ipfs/QmSPYQV89xvj1aaQcPtoAsyVJNUF8sb27uvoHxNdBZPsaV",
      text: t("ekza.v2.ecosystem.projects.stellar"),
      link: "https://stellar.ekza.io",
      isFlip: true,
    },
    {
      projectName: "Avatar",
      imgPath:
        "https://ipfs.io/ipfs/QmNStm5ABJp8gBPsJER4yzG5EUwforVxXQNjbkVuKPu9Nr",
      imgPath2:
        "https://ipfs.io/ipfs/QmanL1Qp6t4nAW4gyfHG1zKj4u8Scyh7Q7ypBPMewLHEB1",
      text: t("ekza.v2.ecosystem.projects.avatar"),
      link: "https://avatar.ekza.io",
      isFlip: true,
    },
    {
      projectName: "Space",
      imgPath:
        "https://ipfs.io/ipfs/QmaBTrVEcyjdj4ky8pRQ2h3dQrGD8bNup5WXx3QjLmZ3PR",
      imgPath2: "",
      text: t("ekza.v2.ecosystem.projects.space"),
      link: "https://space.ekza.io",
      isFlip: true,
    },
  ];

  const heroButtons = [
    {
      text: t("ekza.v2.home.hero.buttons.reserve"),
      onClick: openReserve,
      variant: "primary" as const,
    },
    {
      text: t("ekza.v2.home.hero.buttons.howItWorks"),
      link: "#how-pieces-fit",
      variant: "secondary" as const,
    },
    {
      text: t("ekza.v2.home.hero.buttons.developers"),
      link: "/developers",
      variant: "link" as const,
    },
  ];

  const ctaLinks = [
    { label: "Discord", href: "https://discord.gg/yUWb4Q5b", external: true },
    { label: "X", href: "https://twitter.com/EkzaSpace", external: true },
    { label: "Telegram", href: "https://t.me/ekzaspace", external: true },
  ];

  return (
    <main className="font-ekza text-ekza-on">
      <HeroSection
        imageUrl="/img/ekza_wotori_space.jpeg"
        imageAlt="Ekza — a universe built together"
        quoteEyebrow={t("ekza.v2.home.hero.eyebrow")}
        title={t("ekza.v2.home.hero.headline")}
        subtitle={t("ekza.v2.home.hero.subhead")}
        description={t("ekza.v2.home.hero.description")}
        buttons={heroButtons}
        heroHeight="min-h-[calc(100svh-5rem)]"
        footerLeft={t("ekza.v2.home.hero.footerLeft")}
        footerCenter={t("ekza.v2.home.hero.footerCenter")}
        rightVisual={<SpaceCardVisual id={1} total={1000} name="Genesis Hall" />}
      />

      <FactStrip itemsKey="ekza.v2.home.factStrip.items" />

      <HowPiecesFit />

      <LiveWorldEmbed />

      <PrimitiveGrid
        variant="teaser"
        id="why-own"
        eyebrow={t("ekza.v2.home.whyOwn.eyebrow")}
        headline={t("ekza.v2.home.whyOwn.headline")}
        subcopy={t("ekza.v2.home.whyOwn.subcopy")}
        linkLabel={t("ekza.v2.home.whyOwn.link")}
        linkHref="/protocol"
      />

      <CredibilityBand showRoadmap={false} />

      <Roadmap />

      <SpaceOffer />

      <section
        id="ecosystem-modules"
        className="border-t border-ekza-border/15 bg-ekza-muted py-20 dark:border-white/5 dark:bg-[#111417] md:py-28"
      >
        <div className="container mx-auto px-6 text-center">
          <Reveal className="mx-auto max-w-3xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90">
              {t("ekza.v2.ecosystem.eyebrow")}
            </p>
            <h2 className="font-headline text-4xl font-bold tracking-tight text-ekza-on dark:text-white md:text-5xl">
              {t("ekza.v2.ecosystem.headline")}
            </h2>
            <p className="mx-auto mb-10 mt-5 max-w-3xl text-lg font-light text-ekza-on-muted dark:text-white/70">
              {t("ekza.v2.ecosystem.subcopy")}
            </p>
          </Reveal>
          <div className="flex flex-col items-stretch justify-center gap-8 md:flex-row">
            <ProjectCards projects={projects} />
          </div>
        </div>
      </section>

      <PartnerSpotlight />

      <FinalCta
        headline={t("ekza.v2.home.finalCta.headline")}
        subcopy={t("ekza.v2.home.finalCta.subcopy")}
        primaryLabel={t("ekza.v2.home.finalCta.cta")}
        onPrimary={openReserve}
        secondary={ctaLinks}
      />
    </main>
  );
}

export default HomeView;
