"use client";

import { Reveal } from "./motion";

const FEATURES = [
  {
    accent: "from-omoba-accent to-omoba-magenta",
    title: "Classic depth",
    body: "Lane strategy, team fights and skill expression you know from the greats — tuned for competitive play.",
  },
  {
    accent: "from-omoba-gold to-omoba-ember",
    title: "Creator layer",
    body: "Tools and pipelines for heroes, cosmetics and stories — designed, owned and monetized by players.",
  },
];

export function SectionEvolution() {
  return (
    <section
      id="evolution"
      className="relative border-t border-white/5 bg-omoba-abyss/80 py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <Reveal as="p" className="omoba-kicker text-omoba-gold">
            Gameplay &amp; vision
          </Reveal>
          <Reveal
            as="h2"
            delay={80}
            className="mt-5 font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl"
          >
            The next evolution of MOBA
          </Reveal>
          <Reveal as="p" delay={140} className="mt-6 text-lg leading-relaxed text-slate-400">
            Imagine a game that combines the beloved mechanics of classics like
            League of Legends and Dota 2 with a fully open model for
            user-generated content — where the people who build the game also own
            it.
          </Reveal>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f, i) => (
            <Reveal
              key={f.title}
              delay={i * 90}
              className={`omoba-glass omoba-glass-hover rounded-2xl p-6 ${i === 1 ? "sm:mt-8" : ""}`}
            >
              <div className={`mb-3 h-2 w-12 rounded-full bg-gradient-to-r ${f.accent}`} />
              <h3 className="font-display text-lg font-semibold text-white">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-slate-400">{f.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
