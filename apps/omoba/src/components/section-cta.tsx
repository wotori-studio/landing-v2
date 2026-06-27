"use client";

import { Reveal } from "./motion";
import { OMOBA_LINKS } from "@/lib/links";

export function SectionCta() {
  return (
    <section className="omoba-cta-glow relative border-t border-white/5 py-28 sm:py-36">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal as="p" className="omoba-kicker justify-center text-omoba-accent">
          Join the build
        </Reveal>
        <Reveal
          as="h2"
          delay={80}
          className="mt-5 font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl md:text-6xl"
        >
          Build the game{" "}
          <span className="omoba-grad">with us</span>.
        </Reveal>
        <Reveal as="p" delay={140} className="mx-auto mt-6 max-w-xl text-lg text-slate-300">
          O-MOBA is open source and community-first. Jump into Discord, star the
          repo, and help shape the open MOBA.
        </Reveal>
        <Reveal delay={200} className="mt-10 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
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
            className="omoba-btn-secondary text-center"
          >
            Star on GitHub
          </a>
        </Reveal>
      </div>
    </section>
  );
}
