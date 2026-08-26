"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "../lib/i18n-provider";
import { Reveal } from "./motion";

export function HowPiecesFit() {
  const { t } = useI18n();

  const steps = [
    {
      n: "01",
      img: "/img/hpf-create.jpg",
      title: t("ekza.v2.home.howPiecesFit.step1.title"),
      body: t("ekza.v2.home.howPiecesFit.step1.body"),
      link: { label: t("ekza.v2.home.howPiecesFit.step1.link"), href: "/protocol" },
    },
    {
      n: "02",
      img: "/img/hpf-bundle.jpg",
      title: t("ekza.v2.home.howPiecesFit.step2.title"),
      body: t("ekza.v2.home.howPiecesFit.step2.body"),
      link: { label: t("ekza.v2.home.howPiecesFit.step2.link"), href: "#space-offer" },
    },
    {
      n: "03",
      img: "/img/hpf-play.jpg",
      title: t("ekza.v2.home.howPiecesFit.step3.title"),
      body: t("ekza.v2.home.howPiecesFit.step3.body"),
      badge: t("ekza.v2.home.howPiecesFit.step3.badge"),
    },
  ];

  return (
    <section
      id="how-pieces-fit"
      className="border-t border-ekza-border/15 bg-ekza-muted py-20 dark:border-white/5 dark:bg-[#111417] md:py-28"
    >
      <div className="container mx-auto px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90">
            {t("ekza.v2.home.howPiecesFit.eyebrow")}
          </p>
          <h2 className="font-headline text-4xl font-bold tracking-tight text-ekza-on dark:text-white md:text-5xl">
            {t("ekza.v2.home.howPiecesFit.headline")}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-light text-ekza-on-muted dark:text-white/70">
            {t("ekza.v2.home.howPiecesFit.subcopy")}
          </p>
        </Reveal>

        <div className="mt-14 grid items-stretch gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal
              key={step.n}
              delay={index * 90}
              as="article"
              className="group relative flex flex-col rounded-2xl border border-ekza-border/25 bg-ekza-elevated/95 p-7 shadow-ekza-card transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/[0.05] dark:shadow-ekza-card-dark"
            >
              {/* connector arrow to next card (desktop) */}
              {index < steps.length - 1 && (
                <span
                  className="pointer-events-none absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 text-2xl text-ekza-primary/50 dark:text-cyan-300/40 md:block"
                  aria-hidden
                >
                  →
                </span>
              )}
              <div className="relative -mx-7 -mt-7 mb-6 aspect-[16/9] overflow-hidden rounded-t-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={step.img}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              <span className="font-headline text-5xl font-bold leading-none text-ekza-primary/40 dark:text-cyan-300/40">
                {step.n}
              </span>
              <h3 className="mt-4 font-headline text-xl font-semibold text-ekza-on dark:text-white">
                {step.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ekza-on-muted dark:text-white/75">
                {step.body}
              </p>
              <div className="mt-5">
                {step.link ? (
                  step.link.href.startsWith("#") ? (
                    <a
                      href={step.link.href}
                      className="link inline-flex items-center gap-1 text-sm font-medium"
                    >
                      {step.link.label}
                      <span aria-hidden>→</span>
                    </a>
                  ) : (
                    <Link
                      href={step.link.href}
                      className="link inline-flex items-center gap-1 text-sm font-medium"
                    >
                      {step.link.label}
                      <span aria-hidden>→</span>
                    </Link>
                  )
                ) : step.badge ? (
                  <span className="inline-flex rounded-full border border-amber-400/50 bg-amber-100/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-950 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-100">
                    {step.badge}
                  </span>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowPiecesFit;
