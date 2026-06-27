"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ParticleSparks } from "./particle-sparks";
import { OMOBA_LINKS } from "@/lib/links";

const STATS = [
  { metric: "100%", label: "Open source" },
  { metric: "Creator-owned", label: "Heroes & skins" },
  { metric: "Solana", label: "On-chain economy" },
];

export function HeroSection() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(Math.min(window.scrollY * 0.35, 160));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-16 pt-28 sm:justify-center sm:pb-24 sm:pt-32"
    >
      <div className="absolute inset-0 omoba-mesh" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{ transform: `translateY(${offset * 0.15}px)` }}
        aria-hidden
      >
        <div
          className="absolute -left-1/4 top-1/4 h-[min(90vw,520px)] w-[min(90vw,520px)] rounded-full bg-gradient-to-br from-omoba-magenta/25 via-transparent to-omoba-accent/10 blur-3xl"
          style={{ transform: `translateY(${-offset * 0.08}px)` }}
        />
        <div
          className="absolute -right-1/4 bottom-0 h-[min(80vw,480px)] w-[min(80vw,480px)] rounded-full bg-gradient-to-tl from-omoba-accent/20 via-omoba-gold/10 to-transparent blur-3xl"
          style={{ transform: `translateY(${offset * 0.12}px)` }}
        />
      </div>
      <ParticleSparks count={56} />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-omoba-accent/30 bg-omoba-accent/5 px-4 py-1.5 font-display text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-omoba-accent">
            <span className="omoba-phase__dot !mr-0" />
            Pre-alpha · open source · web3
          </span>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            The open MOBA where{" "}
            <span className="omoba-grad">players own the game</span>.
          </h1>

          <p className="mt-6 text-lg font-light leading-relaxed text-slate-300 sm:text-xl md:max-w-2xl">
            Classic lane-pushing depth meets a fully open creator economy. Design
            heroes, skins and stories — keep ownership, and share directly in the
            game&apos;s success.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <a
              href={OMOBA_LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="omoba-btn-primary text-center"
            >
              Join community
            </a>
            <a
              href={OMOBA_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="omoba-btn-secondary inline-flex items-center justify-center gap-2 text-center"
            >
              <span>GitHub</span>
              <span className="text-xs font-normal normal-case tracking-normal text-slate-500">
                open source
              </span>
            </a>
          </div>

          <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">
            {STATS.map((s) => (
              <div className="omoba-stat" key={s.label}>
                <dt className="omoba-stat__metric omoba-grad">{s.metric}</dt>
                <dd className="omoba-stat__label">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          className="relative mt-16 hidden max-w-4xl lg:block"
          style={{ transform: `translateY(${-offset * 0.05}px)` }}
        >
          <div className="pointer-events-none absolute -inset-6 rounded-[28px] bg-gradient-to-r from-omoba-accent/15 via-omoba-magenta/10 to-omoba-gold/10 blur-2xl" />
          <div className="omoba-glass omoba-glass-hover relative rounded-2xl p-1">
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl bg-omoba-abyss">
              <Image
                src="/img/omoba.png"
                alt="O-MOBA — arena concept"
                width={1500}
                height={931}
                className="h-full w-full object-cover object-center"
                sizes="(max-width: 1024px) 0px, min(896px, 90vw)"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-omoba-void/60 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>

      <a
        href="#evolution"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 font-display text-[0.7rem] uppercase tracking-[0.3em] text-slate-500 transition hover:text-omoba-accent sm:block"
      >
        scroll ↓
      </a>
    </section>
  );
}
