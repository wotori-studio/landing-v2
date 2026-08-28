"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/motion";
import { MIRROR_LINKS } from "@/lib/links";

type Avatar = {
  id: number;
  name: string;
  universe: string;
  line: string;
  src: string;
  alt: string;
  /** Gradient stand-in, used if the art is missing. */
  fallback: string;
};

const AVATARS: Avatar[] = [
  {
    id: 1,
    name: "Vessel",
    universe: "Ekza Avatar",
    line: "The unpainted one. The shell you step into before you pick a face.",
    src: "/img/avatar-1.jpg",
    alt: "Vessel — a blank paper-white punk creature in an undecorated jacket.",
    fallback:
      "radial-gradient(80% 70% at 30% 20%, rgba(124,92,255,0.55), transparent 65%), linear-gradient(160deg, #171728 0%, #0B0B14 100%)",
  },
  {
    id: 2,
    name: "Nomad",
    universe: "Ekza Stellar",
    line: "Hooded drifter with a blank faceplate. Hash checked before it renders.",
    src: "/img/avatar-2.jpg",
    alt: "Nomad — a hooded punk creature with a masked faceplate and spiked crest.",
    fallback:
      "radial-gradient(75% 65% at 70% 25%, rgba(233,236,245,0.35), transparent 62%), linear-gradient(160deg, #1B1B26 0%, #0A0A12 100%)",
  },
  {
    id: 3,
    name: "Prism",
    universe: "Ekza Space",
    line: "Split face, six eyes, crystal crest. Built for the seam.",
    src: "/img/avatar-3.jpg",
    alt: "Prism — a slim neon punk creature with a split face and crystal crest.",
    fallback:
      "radial-gradient(80% 70% at 40% 30%, rgba(255,95,162,0.5), transparent 60%), radial-gradient(70% 60% at 75% 80%, rgba(53,232,255,0.4), transparent 65%), linear-gradient(160deg, #141426 0%, #08080F 100%)",
  },
  {
    id: 4,
    name: "Ronin",
    universe: "Ekza Arena",
    line: "Horned, tusked, twice your width. Waiting on the rig.",
    src: "/img/avatar-4.jpg",
    alt: "Ronin — a horned, armoured brute of a punk creature in a studded jacket.",
    fallback:
      "radial-gradient(75% 65% at 55% 20%, rgba(53,232,255,0.42), transparent 62%), linear-gradient(160deg, #101823 0%, #07070C 100%)",
  },
];

export function SectionAvatars() {
  const [activeId, setActiveId] = useState(AVATARS[0].id);
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  const active = AVATARS.find((a) => a.id === activeId) ?? AVATARS[0];
  const markFailed = (id: number) =>
    setFailed((prev) => (prev[id] ? prev : { ...prev, [id]: true }));

  return (
    <section
      id="avatars"
      className="relative overflow-hidden border-t border-mirror-chrome/10 bg-mirror-void py-24 sm:py-32"
    >
      <div className="mir-grain pointer-events-none absolute inset-0" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(124,92,255,0.16),transparent_70%)]"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <Reveal as="p" className="mir-kicker text-mirror-violet">
            pick your face
          </Reveal>
          <Reveal
            as="h2"
            delay={80}
            className="mt-5 font-display text-3xl font-bold tracking-[-0.02em] text-mirror-chrome sm:text-4xl md:text-5xl"
          >
            Choose who your friend <span className="mir-grad">becomes</span>.
          </Reveal>
          <Reveal
            as="p"
            delay={140}
            className="mt-5 text-base leading-relaxed text-mirror-silver sm:text-lg"
          >
            Six verified VRM avatars live on devnet today — the resolver checks
            provenance and a SHA-256 before anything renders. Mirror wears a
            procedural volumetric avatar right now; the rigged Ekza characters
            land next.
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-12">
          {/* preview */}
          <Reveal className="mir-glass relative overflow-hidden p-2">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-mirror-surface">
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ backgroundImage: active.fallback }}
              />
              <span
                aria-hidden
                className="mir-grad absolute inset-0 flex items-center justify-center font-display text-[7rem] font-bold leading-none opacity-30"
              >
                {active.name.charAt(0)}
              </span>
              {failed[active.id] ? null : (
                <Image
                  key={active.src}
                  src={active.src}
                  alt={active.alt}
                  width={800}
                  height={1000}
                  sizes="(max-width: 1024px) 92vw, 440px"
                  onError={() => markFailed(active.id)}
                  className="relative h-full w-full object-cover object-center"
                />
              )}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-mirror-void via-mirror-void/70 to-transparent"
              />

              <div
                aria-live="polite"
                className="absolute inset-x-0 bottom-0 p-5 sm:p-6"
              >
                <p className="font-display text-[0.62rem] uppercase tracking-[0.28em] text-mirror-aqua">
                  {active.universe}
                </p>
                <h3 className="mt-2 font-display text-3xl font-bold tracking-[-0.02em] text-mirror-chrome sm:text-4xl">
                  {active.name}
                </h3>
                <div className="mt-4 w-16">
                  <div className="mir-seam" aria-hidden />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-mirror-silver">
                  {active.line}
                </p>
              </div>
            </div>
          </Reveal>

          {/* picker */}
          <div>
            <Reveal
              as="p"
              className="font-display text-[0.62rem] uppercase tracking-[0.26em] text-mirror-silver"
            >
              catalog preview · tap to try one on
            </Reveal>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
              {AVATARS.map((avatar, i) => {
                const selected = avatar.id === active.id;
                return (
                  <Reveal key={avatar.id} delay={i * 70}>
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setActiveId(avatar.id)}
                      className={`group relative block w-full overflow-hidden rounded-2xl border text-left transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-mirror-aqua focus-visible:ring-offset-2 focus-visible:ring-offset-mirror-void ${
                        selected
                          ? "border-mirror-rose/60 shadow-[0_0_36px_-8px_rgba(255,95,162,0.55)]"
                          : "border-mirror-chrome/10 hover:border-mirror-violet/50"
                      }`}
                    >
                      <span className="relative block aspect-[4/5] w-full overflow-hidden bg-mirror-surface">
                        <span
                          aria-hidden
                          className="absolute inset-0"
                          style={{ backgroundImage: avatar.fallback }}
                        />
                        <span
                          aria-hidden
                          className="mir-grad absolute inset-0 flex items-center justify-center font-display text-5xl font-bold leading-none opacity-30"
                        >
                          {avatar.name.charAt(0)}
                        </span>
                        {failed[avatar.id] ? null : (
                          <Image
                            src={avatar.src}
                            alt={avatar.alt}
                            width={400}
                            height={500}
                            sizes="(max-width: 640px) 45vw, 200px"
                            onError={() => markFailed(avatar.id)}
                            className={`relative h-full w-full object-cover object-center transition duration-500 ${
                              selected
                                ? "scale-[1.03]"
                                : "opacity-70 group-hover:opacity-100"
                            }`}
                          />
                        )}
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-mirror-void/95 to-transparent"
                        />
                      </span>

                      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3">
                        <span className="font-display text-sm font-semibold text-mirror-chrome">
                          {avatar.name}
                        </span>
                        <span
                          aria-hidden
                          className={`h-1.5 w-1.5 rounded-full transition ${
                            selected ? "bg-mirror-rose" : "bg-mirror-chrome/25"
                          }`}
                        />
                      </span>
                      <span className="sr-only">
                        {selected ? "Selected. " : ""}
                        {avatar.universe}. {avatar.line}
                      </span>
                    </button>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={220} className="mir-glass mt-6 rounded-2xl p-5 sm:p-6">
              <p className="text-sm leading-relaxed text-mirror-silver">
                Avatars come from the Ekza catalog, not from Mirror. Own one
                anywhere in the ecosystem and it follows you here — that is the
                whole point of the lens.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                <a
                  href={MIRROR_LINKS.avatars}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-[0.68rem] uppercase tracking-[0.22em] text-mirror-chrome underline-offset-4 transition hover:text-mirror-aqua hover:underline"
                >
                  Browse the catalog →
                </a>
                <a
                  href={MIRROR_LINKS.stellar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-[0.68rem] uppercase tracking-[0.22em] text-mirror-silver underline-offset-4 transition hover:text-mirror-aqua hover:underline"
                >
                  Where ownership lives →
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
