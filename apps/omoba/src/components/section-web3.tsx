"use client";

import { Reveal } from "./motion";

const bullets = [
  {
    title: "Powered by DAO",
    body: "An open-source, blockchain-based platform that transparently distributes profits to the creators and contributors who build it.",
  },
  {
    title: "True ownership",
    body: "Assets live as on-chain tokens — heroes, skins and items you actually own, trade and carry across the ecosystem.",
  },
  {
    title: "Build universes",
    body: "Collaboratively weave your creations into a shared, ever-expanding web3 multiverse.",
  },
];

export function SectionWeb3() {
  return (
    <section
      id="tech"
      className="relative border-t border-white/5 bg-omoba-depth/40 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-1/2 top-1/2 h-[min(100vw,600px)] w-[min(100vw,600px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-omoba-accent/20" />
        <div className="absolute left-1/2 top-1/2 h-[min(70vw,420px)] w-[min(70vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-omoba-magenta/15" />
        <div className="absolute left-1/2 top-1/2 h-[min(40vw,240px)] w-[min(40vw,240px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-omoba-gold/10" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal as="p" className="omoba-kicker justify-center text-omoba-magenta">
            Web3 multiverse
          </Reveal>
          <Reveal
            as="h2"
            delay={80}
            className="mt-5 font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl"
          >
            Tech &amp; DAO
          </Reveal>
          <Reveal as="p" delay={140} className="mt-4 text-slate-400">
            Whitepaper and technical deep-dive coming soon — here are the core
            pillars.
          </Reveal>
        </div>
        <ul className="mt-14 space-y-6">
          {bullets.map((b, i) => (
            <Reveal
              as="li"
              key={b.title}
              delay={i * 80}
              className="omoba-glass omoba-glass-hover flex gap-6 rounded-2xl p-6 sm:p-8"
            >
              <span className="font-display text-2xl font-bold text-omoba-accent/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-white">
                  {b.title}
                </h3>
                <p className="mt-2 text-slate-400">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
