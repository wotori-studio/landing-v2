"use client";

import { Reveal } from "./motion";

const PHASES = [
  {
    tag: "Phase 01",
    live: true,
    title: "Foundations",
    body: "Open-source org, engine R&D and a community of builders forming in the open.",
  },
  {
    tag: "Phase 02",
    live: false,
    title: "Creator tools",
    body: "Asset pipeline for heroes & skins, plus the first marketplace alpha.",
  },
  {
    tag: "Phase 03",
    live: false,
    title: "Playable alpha",
    body: "Core MOBA loop with custom, creator-made heroes entering live matches.",
  },
  {
    tag: "Phase 04",
    live: false,
    title: "On-chain economy",
    body: "DAO governance, token and transparent creator payouts go live.",
  },
];

export function SectionRoadmap() {
  return (
    <section
      id="roadmap"
      className="relative border-t border-white/5 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal as="p" className="omoba-kicker justify-center text-omoba-accent">
            Where we&apos;re headed
          </Reveal>
          <Reveal
            as="h2"
            delay={80}
            className="mt-5 font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl"
          >
            Roadmap
          </Reveal>
          <Reveal as="p" delay={140} className="mt-4 text-slate-400">
            Built in the open, shipped in phases — follow along and shape what
            comes next.
          </Reveal>
        </div>

        <div className="omoba-roadmap mt-14">
          {PHASES.map((p, i) => (
            <Reveal key={p.tag} delay={i * 80} data-live={p.live} className="omoba-phase">
              <p className={`omoba-phase__tag ${p.live ? "text-omoba-accent" : "text-slate-500"}`}>
                {p.live && <span className="omoba-phase__dot" />}
                {p.tag}
              </p>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
