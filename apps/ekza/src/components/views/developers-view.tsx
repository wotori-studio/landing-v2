"use client";

import React from "react";
import { HeroSection } from "../hero-section";
import { ProgramsOverview } from "../programs-overview";
import { DeveloperSection } from "../developer-section";
import { VerifyBand } from "../verify-band";
import { FinalCta } from "../final-cta";
import { useI18n } from "../../lib/i18n-provider";
import { useReserve } from "../../app/reserve-provider";

const STELLAR_PROGRAM_ID = "3rVXfq7LLSLqbDzvZuSrQoMytwczLj2Q8Hue62rxPZAA";

export function DevelopersView() {
  const { t } = useI18n();
  const { openReserve } = useReserve();

  const heroButtons = [
    {
      text: t("ekza.v2.dev.hero.btnGithub"),
      link: "https://github.com/ekza-space",
      variant: "primary" as const,
    },
    {
      text: t("ekza.v2.dev.hero.btnReserve"),
      onClick: openReserve,
      variant: "secondary" as const,
    },
  ];

  const stellarInstructions = [
    { name: "create_universe", body: t("ekza.v2.dev.stellar.createUniverse") },
    { name: "create_asset", body: t("ekza.v2.dev.stellar.createAsset") },
    { name: "finalize_release", body: t("ekza.v2.dev.stellar.finalizeRelease") },
    { name: "deposit_revenue", body: t("ekza.v2.dev.stellar.depositRevenue") },
    { name: "claim_revenue", body: t("ekza.v2.dev.stellar.claimRevenue") },
  ];

  const stellarFacts = [
    { label: "Program", value: "solana_stellar" },
    { label: "Program ID", value: STELLAR_PROGRAM_ID },
    {
      label: "PDA seeds",
      value: "registry · universe · asset · link · release · release_vault · share",
    },
    { label: "Revenue", value: "basis points (BPS_DENOMINATOR = 10,000)" },
    {
      label: "Events",
      value:
        "UniverseCreated · AssetCreated · ReleaseCreated · RevenueDeposited · RevenueClaimed",
    },
  ];

  return (
    <main className="font-ekza text-ekza-on">
      <HeroSection
        imageUrl="/img/distr.jpeg"
        imageAlt="Ekza for developers — open Anchor programs on Solana"
        quoteEyebrow={t("ekza.v2.dev.hero.eyebrow")}
        title={t("ekza.v2.dev.hero.headline")}
        subtitle={t("ekza.v2.dev.hero.subhead")}
        buttons={heroButtons}
        heroHeight="min-h-[78vh]"
        footerLeft={t("ekza.v2.dev.hero.footerLeft")}
        footerCenter={t("ekza.v2.dev.hero.footerCenter")}
      />

      <ProgramsOverview />

      {/* Space program detail (code-verified) */}
      <DeveloperSection id="space-program" />

      {/* Stellar program detail (verified against solana-stellar source) */}
      <DeveloperSection
        id="stellar-program"
        eyebrow={t("ekza.v2.dev.stellar.eyebrow")}
        headline={t("ekza.v2.dev.stellar.headline")}
        subcopy={t("ekza.v2.dev.stellar.subcopy")}
        instructions={stellarInstructions}
        facts={stellarFacts}
        programId={STELLAR_PROGRAM_ID}
        terminalLabel="solana_stellar — on-chain"
        ctaLabel={t("ekza.v2.dev.stellar.cta")}
      />

      <VerifyBand />

      <FinalCta
        headline={t("ekza.v2.dev.githubCta.headline")}
        subcopy={t("ekza.v2.dev.githubCta.subcopy")}
        primaryLabel={t("ekza.v2.dev.githubCta.primary")}
        primaryHref="https://github.com/ekza-space"
        primaryExternal
        secondary={[
          { label: `${t("ekza.v2.dev.githubCta.secondary")} →`, onClick: openReserve },
        ]}
        showNewsletter={false}
      />
    </main>
  );
}

export default DevelopersView;
