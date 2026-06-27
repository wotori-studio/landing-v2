"use client";

import { Reveal } from "./motion";

const cards = [
  {
    no: "01",
    title: "Design everything",
    body: "Create unique characters — appearances, backstories, professions and abilities. Your imagination is the only limit.",
    accent: "from-omoba-accent to-cyan-600",
  },
  {
    no: "02",
    title: "Open marketplace",
    body: "Publish your creations to a global, permissionless marketplace and reach every player in the arena.",
    accent: "from-omoba-magenta to-violet-600",
  },
  {
    no: "03",
    title: "Direct support",
    body: "Fans buy your skins and characters directly. Keep full ownership, with limited or unlimited editions — your call.",
    accent: "from-omoba-gold to-omoba-ember",
  },
];

export function SectionCreators() {
  return (
    <section
      id="creators"
      className="relative border-t border-white/5 py-24 sm:py-32"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-omoba-void via-omoba-depth/50 to-omoba-void" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal as="p" className="omoba-kicker justify-center text-omoba-accent">
            For creators
          </Reveal>
          <Reveal
            as="h2"
            delay={80}
            className="mt-5 font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl"
          >
            Create, share, earn
          </Reveal>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal
              as="article"
              key={c.title}
              delay={i * 90}
              className="omoba-glass omoba-glass-hover group rounded-2xl p-8"
            >
              <span className="font-display text-sm font-bold text-omoba-accent/70">
                {c.no}
              </span>
              <div className={`mt-4 mb-6 h-1 w-16 rounded-full bg-gradient-to-r ${c.accent}`} />
              <h3 className="font-display text-xl font-semibold text-white">
                {c.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">{c.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
