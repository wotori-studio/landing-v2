"use client";

import React from "react";
import { useI18n } from "../lib/i18n-provider";
import { Reveal } from "./motion";

const SPACE_PROGRAM_ID = "2WtuXG6AX3erRp6eK5WiSTEEBec5zprQ7qLyLENfMQEH";
const STELLAR_PROGRAM_ID = "3rVXfq7LLSLqbDzvZuSrQoMytwczLj2Q8Hue62rxPZAA";

export function ProgramsOverview() {
  const { t } = useI18n();

  const programs = [
    {
      name: t("ekza.v2.dev.programs.space.name"),
      body: t("ekza.v2.dev.programs.space.body"),
      href: `https://explorer.solana.com/address/${SPACE_PROGRAM_ID}?cluster=devnet`,
      anchor: "#space-program",
    },
    {
      name: t("ekza.v2.dev.programs.stellar.name"),
      body: t("ekza.v2.dev.programs.stellar.body"),
      href: `https://explorer.solana.com/address/${STELLAR_PROGRAM_ID}?cluster=devnet`,
      anchor: "#stellar-program",
    },
    {
      name: t("ekza.v2.dev.programs.arena.name"),
      body: t("ekza.v2.dev.programs.arena.body"),
      href: "https://github.com/ekza-space",
    },
  ];

  return (
    <section
      id="programs"
      className="border-t border-ekza-border/15 bg-ekza-muted py-20 dark:border-white/5 dark:bg-[#111417] md:py-28"
    >
      <div className="container mx-auto px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90">
            {t("ekza.v2.dev.programs.eyebrow")}
          </p>
          <h2 className="font-headline text-4xl font-bold tracking-tight text-ekza-on dark:text-white md:text-5xl">
            {t("ekza.v2.dev.programs.headline")}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {programs.map((program, index) => (
            <Reveal
              key={program.name}
              delay={index * 80}
              as="article"
              className="flex flex-col rounded-2xl border border-ekza-border/25 bg-ekza-elevated/95 p-7 shadow-ekza-card transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/[0.05] dark:shadow-ekza-card-dark"
            >
              <h3 className="font-mono text-base font-semibold text-ekza-primary dark:text-cyan-300">
                {program.name}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ekza-on-muted dark:text-white/75">
                {program.body}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                {program.anchor && (
                  <a
                    href={program.anchor}
                    className="link inline-flex items-center gap-1 text-sm font-medium"
                  >
                    Details
                    <span aria-hidden>→</span>
                  </a>
                )}
                <a
                  href={program.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-ekza-on-muted transition hover:text-ekza-primary dark:text-white/60 dark:hover:text-cyan-300"
                >
                  Explorer
                  <span aria-hidden>↗</span>
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProgramsOverview;
