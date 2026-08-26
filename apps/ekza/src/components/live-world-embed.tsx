"use client";

import React, { useState } from "react";
import { useI18n } from "../lib/i18n-provider";
import { Reveal } from "./motion";

// Interactive narrated demo (Wang + click bursts, NFT plants, collecting) —
// see core /demo2 route.
const APP_URL = "https://space.ekza.io/demo2";

/**
 * Click-to-activate live embed of the Ekza Space 3D world, loaded IN-PLACE inside
 * the preview card with a preloader over the poster.
 * - Desktop (fine pointer + wide): poster → spinner over poster → iframe fades in
 *   inside the same card. Close (×) collapses back to the poster.
 * - Mobile / coarse pointer: opens space.ekza.io in a new tab (no nested-scroll trap).
 * The iframe is only mounted after click, so the heavy WebGL payload never hits first load.
 */
export function LiveWorldEmbed() {
  const { t } = useI18n();
  const k = (key: string) => t(`ekza.v2.home.liveWorld.${key}`);
  const [active, setActive] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const canEmbed = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(pointer: fine)").matches &&
    window.innerWidth >= 1024;

  const activate = () => {
    if (canEmbed()) {
      setLoaded(false);
      setActive(true);
    } else {
      window.open(APP_URL, "_blank", "noopener,noreferrer");
    }
  };

  const exit = () => {
    setActive(false);
    setLoaded(false);
  };

  return (
    <section
      id="live-world"
      className="border-t border-ekza-border/20 bg-ekza-muted py-20 dark:border-white/10 dark:bg-[#0c0e12] md:py-28"
    >
      <div className="container mx-auto px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90">
            {k("eyebrow")}
          </p>
          <h2 className="font-headline text-4xl font-bold tracking-tight text-ekza-on dark:text-white md:text-5xl">
            {k("headline")}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-light text-ekza-on-muted dark:text-white/70">
            {k("subcopy")}
          </p>
        </Reveal>

        <Reveal delay={80} className="mx-auto mt-12 max-w-5xl">
          <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-ekza-border/30 shadow-ekza-card dark:border-white/10 dark:shadow-ekza-card-dark">
            {/* Poster (idle) — also stays underneath while the iframe loads */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/world-portal.jpg"
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${
                active ? "scale-105 blur-sm" : "group-hover:scale-[1.03]"
              }`}
              loading="lazy"
            />

            {/* Idle overlay — play button */}
            {!active && (
              <button
                type="button"
                onClick={activate}
                aria-label={k("cta")}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-t from-black/70 via-black/20 to-black/30 transition"
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-md transition group-hover:scale-110 group-hover:border-white/70 group-hover:bg-white/20">
                  <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden className="ml-1 text-white">
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                </span>
                <span className="font-headline text-base font-semibold uppercase tracking-[0.2em] text-white sm:text-lg">
                  <span className="hidden lg:inline">{k("cta")}</span>
                  <span className="lg:hidden">{k("ctaMobile")}</span>
                </span>
                <span className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/70">
                  {k("note")}
                </span>
              </button>
            )}

            {/* Active — iframe in-place + preloader over the poster */}
            {active && (
              <>
                <iframe
                  src={APP_URL}
                  title="Ekza Space — live world"
                  className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-700 ${
                    loaded ? "opacity-100" : "opacity-0"
                  }`}
                  allow="fullscreen; autoplay; xr-spatial-tracking; clipboard-write"
                  onLoad={() => setLoaded(true)}
                />

                {/* Preloader over the (blurred) poster until the world is ready */}
                {!loaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/45 backdrop-blur-[1px]">
                    <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/25 border-t-cyan-300" />
                    <span className="text-sm text-white/80">{k("loading")}</span>
                    <a
                      href={APP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs uppercase tracking-wide text-cyan-300 underline-offset-4 hover:underline"
                    >
                      {k("openTab")} ↗
                    </a>
                  </div>
                )}

                {/* Controls */}
                <div className="absolute right-3 top-3 flex items-center gap-2">
                  <a
                    href={APP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={k("openTab")}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 text-xs text-white/80 backdrop-blur-md transition hover:bg-black/60 hover:text-white"
                  >
                    {APP_URL.replace("https://", "")} ↗
                  </a>
                  <button
                    type="button"
                    onClick={exit}
                    aria-label={k("close")}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default LiveWorldEmbed;
