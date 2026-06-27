"use client";

import React, { useState } from "react";
import { useI18n } from "../lib/i18n-provider";
import { Reveal } from "./motion";

const SPACE_PROGRAM_ID = "2WtuXG6AX3erRp6eK5WiSTEEBec5zprQ7qLyLENfMQEH";

interface Instruction {
  name: string;
  body: string;
}

interface Fact {
  label: string;
  value: string;
}

interface DeveloperSectionProps {
  id?: string;
  eyebrow?: string;
  headline?: string;
  subcopy?: string;
  instructions?: Instruction[];
  facts?: Fact[];
  // Program id rendered as the copy-to-clipboard line.
  programId?: string;
  terminalLabel?: string;
  githubHref?: string;
  ctaLabel?: string;
}

export function DeveloperSection({
  id = "developers",
  eyebrow,
  headline,
  subcopy,
  instructions,
  facts,
  programId = SPACE_PROGRAM_ID,
  terminalLabel = "solana_ekza_space — on-chain",
  githubHref = "https://github.com/ekza-space",
  ctaLabel,
}: DeveloperSectionProps = {}) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const explorerUrl = `https://explorer.solana.com/address/${programId}?cluster=devnet`;

  const copyProgramId = async () => {
    try {
      await navigator.clipboard.writeText(programId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const resolvedInstructions: Instruction[] =
    instructions ?? [
      { name: "init_config", body: t("ekza.v2.developers.initConfig") },
      { name: "update_config", body: t("ekza.v2.developers.updateConfig") },
      { name: "mint_next_space", body: t("ekza.v2.developers.mintNextSpace") },
      {
        name: "update_space_settings",
        body: t("ekza.v2.developers.updateSpaceSettings"),
      },
    ];

  const resolvedFacts: Fact[] =
    facts ?? [
      { label: "Program", value: "solana_ekza_space" },
      { label: "Program ID", value: programId },
      { label: "Config PDA", value: '["config"]' },
      { label: "Space PDA", value: '["space_v1", config, space_id]' },
      {
        label: "Default metadata",
        value: "https://meta.ekza.space/spaces/{id}.json",
      },
      {
        label: "Events",
        value: "SpaceMinted · SpaceSettingsUpdated · ConfigUpdated",
      },
    ];

  const resolvedEyebrow = eyebrow ?? t("ekza.v2.developers.eyebrow");
  const resolvedHeadline = headline ?? t("ekza.v2.developers.headline");
  const resolvedSubcopy = subcopy ?? t("ekza.v2.developers.subcopy");
  const resolvedCta = ctaLabel ?? t("ekza.v2.developers.cta");

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
          <p className="mx-auto mt-5 max-w-2xl text-lg font-light text-ekza-on-muted dark:text-white/70">
            {resolvedSubcopy}
          </p>
        </Reveal>

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Instruction list */}
          <Reveal className="space-y-4">
            {resolvedInstructions.map((ins) => (
              <article
                key={ins.name}
                className="rounded-2xl border border-ekza-border/25 bg-ekza-elevated/95 p-5 shadow-ekza-card transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/[0.05] dark:shadow-ekza-card-dark"
              >
                <h3 className="font-mono text-sm font-semibold text-ekza-primary dark:text-cyan-300">
                  {ins.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ekza-on-muted dark:text-white/75">
                  {ins.body}
                </p>
              </article>
            ))}
          </Reveal>

          {/* Terminal-style on-chain / PDA code block — trust anchor */}
          <Reveal delay={80}>
            <div className="overflow-hidden rounded-2xl border border-ekza-border/30 bg-[#0c0e12] shadow-ekza-glow ring-1 ring-ekza-border/20 dark:border-white/10 dark:ring-white/5">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                <span className="ml-3 font-mono text-xs text-white/60">
                  {terminalLabel}
                </span>
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[0.65rem] font-medium text-emerald-300 transition hover:bg-emerald-500/20"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {t("ekza.v2.developers.verified")}
                </a>
              </div>
              <div className="space-y-3 px-5 py-5 font-mono text-xs leading-relaxed sm:text-sm">
                {resolvedFacts.map((fact) => {
                  const isProgramId = fact.value === programId;
                  return (
                    <div key={fact.label} className="flex flex-col gap-1">
                      <span className="text-cyan-300/80">{fact.label}</span>
                      {isProgramId ? (
                        <button
                          type="button"
                          onClick={copyProgramId}
                          title={t("ekza.v2.developers.copy")}
                          className="group flex items-start gap-2 text-left text-white/80 transition hover:text-white"
                        >
                          <span className="break-all">{fact.value}</span>
                          <span className="mt-0.5 flex-shrink-0 text-[0.65rem] uppercase tracking-wide text-cyan-300/70 group-hover:text-cyan-300">
                            {copied
                              ? t("ekza.v2.developers.copied")
                              : t("ekza.v2.developers.copy")}
                          </span>
                        </button>
                      ) : (
                        <span className="break-all text-white/80">
                          {fact.value}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 text-center lg:text-left">
              <a
                href={githubHref}
                target="_blank"
                rel="noopener noreferrer"
                className="link font-medium"
              >
                {resolvedCta} →
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default DeveloperSection;
