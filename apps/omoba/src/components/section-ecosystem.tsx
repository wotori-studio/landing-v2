"use client";

import { Reveal } from "./motion";
import { OMOBA_LINKS } from "@/lib/links";

const NODES = [
  { name: "O-MOBA", url: "/", domain: "omoba.io", accent: "text-omoba-accent", external: false },
  { name: "Ekza Space", url: OMOBA_LINKS.ekza, domain: "ekza.io", accent: "text-omoba-magenta", external: true },
  { name: "Wotori Studio", url: "https://wotori.io", domain: "wotori.io", accent: "text-omoba-gold", external: true },
];

export function SectionEcosystem() {
  return (
    <section
      id="ecosystem"
      className="relative border-t border-white/5 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal as="p" className="omoba-kicker justify-center text-omoba-gold">
            Ecosystem
          </Reveal>
          <Reveal
            as="h2"
            delay={80}
            className="mt-5 font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl"
          >
            One connected universe
          </Reveal>
        </div>

        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[120%] max-w-none -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-omoba-accent/40 to-transparent sm:w-[130%]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-omoba-accent/10 blur-2xl" />

          <div className="relative grid gap-6 sm:grid-cols-3">
            {NODES.map((n, i) => (
              <Reveal
                as="a"
                key={n.name}
                delay={i * 80}
                href={n.url}
                {...(n.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="omoba-glass omoba-glass-hover flex flex-col items-center justify-center rounded-2xl p-10 text-center"
              >
                <span className="font-display text-xl font-bold text-white sm:text-2xl">
                  {n.name}
                </span>
                <span className={`mt-1 text-xs ${n.accent}`}>{n.domain}</span>
              </Reveal>
            ))}
          </div>

          <Reveal as="p" delay={160} className="mx-auto mt-10 max-w-xl text-center text-slate-400">
            Closely integrated with{" "}
            <strong className="text-white">Ekza Space</strong> and built by{" "}
            <strong className="text-white">Wotori Studio</strong> — shared assets,
            shared tech, collaborative growth.
          </Reveal>
        </div>
      </div>
    </section>
  );
}
