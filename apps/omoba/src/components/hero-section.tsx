"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ParticleSparks } from "./particle-sparks";
import { OMOBA_LINKS } from "@/lib/links";

export function HeroSection() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setOffset(Math.min(y * 0.35, 160));
    };
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
          <p className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.35em] text-omoba-accent">
            Open source · Open MOBA · Web3
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            O-MOBA — The Open MOBA Ecosystem
          </h1>
          <p className="mt-6 text-lg font-light leading-relaxed text-slate-300 sm:text-xl md:max-w-2xl">
            More than just a game. A creative ecosystem empowering everyone to
            share directly in its success.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <a
              href={OMOBA_LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="omoba-btn-primary text-center"
            >
              Join community
            </a>
            <a href="#tech" className="omoba-btn-secondary text-center">
              Read whitepaper
            </a>
            <a
              href={OMOBA_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="omoba-btn-secondary inline-flex items-center justify-center gap-2 text-center"
            >
              <span>GitHub</span>
              <span className="text-xs font-normal normal-case tracking-normal text-slate-500">
                open source org
              </span>
            </a>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Code, engines, and org updates live on{" "}
            <a
              href={OMOBA_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-omoba-accent underline decoration-omoba-accent/40 underline-offset-4 transition hover:text-cyan-200"
            >
              github.com/o-moba
            </a>
            .
          </p>
        </div>

        <div
          className="relative mt-16 hidden max-w-4xl lg:block"
          style={{ transform: `translateY(${-offset * 0.05}px)` }}
        >
          <div className="omoba-glass omoba-glass-hover rounded-2xl p-1">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
