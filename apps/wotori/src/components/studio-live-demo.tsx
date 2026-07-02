"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./studio-reveal";
import { useI18n } from "../lib/i18n-provider";

// Narrating hero demo served from ekza/core (/demo-hero route). Override via env
// if the demo moves. Heavy 3D bundle (~1.2MB gzip) — only loaded on demand.
const DEMO_URL =
  process.env.NEXT_PUBLIC_LIVE_DEMO_URL || "https://space.ekza.io/demo2";

export default function StudioLiveDemo() {
  const { t, language } = useI18n();
  const k = (key: string) => t(`wotori.studio.liveDemo.${key}`);
  const [load, setLoad] = useState(false);
  const frameRef = useRef<HTMLDivElement | null>(null);

  // Pass the visitor's language + Wang's localized script into the demo, so the
  // in-world narrator speaks whatever language the site is in. The demo maps the
  // lang to a Unicode font (Cyrillic / CJK) on its side.
  const demoSrc = (() => {
    const params = new URLSearchParams({
      lang: language,
      name: k("wangName"),
      lines: k("script"),
    });
    const sep = DEMO_URL.includes("?") ? "&" : "?";
    return `${DEMO_URL}${sep}${params.toString()}`;
  })();

  // Lazy-load the iframe when the section scrolls near the viewport, so the
  // heavy 3D bundle never blocks the marketing page's first paint.
  useEffect(() => {
    if (load) return undefined;
    const el = frameRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [load]);

  return (
    <section className="ws-section ws-livedemo" id="live">
      <div className="ws-shell">
        <header className="ws-head">
          <Reveal as="p" className="ws-index">{k("index")}</Reveal>
          <Reveal as="h2" className="ws-h2" delay={80}>
            {k("heading")}
          </Reveal>
        </header>

        <div className="ws-livedemo__frame" ref={frameRef}>
          {load ? (
            <iframe
              className="ws-livedemo__iframe"
              src={demoSrc}
              title={k("heading")}
              loading="lazy"
              allow="fullscreen; autoplay"
            />
          ) : (
            <button
              type="button"
              className="ws-livedemo__poster"
              onClick={() => setLoad(true)}
            >
              <span className="ws-livedemo__play" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="30" height="30">
                  <path d="M8 5v14l11-7z" fill="currentColor" />
                </svg>
              </span>
              <span className="ws-livedemo__cta">{k("cta")}</span>
            </button>
          )}
        </div>

        <p className="ws-livedemo__note">{k("note")}</p>
      </div>
    </section>
  );
}
