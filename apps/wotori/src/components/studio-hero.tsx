"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { VoxelScene } from "./voxel-scene";
import { Marquee } from "./studio-reveal";
import StudioTerminal from "./studio-terminal";
import { useTheme } from "../lib/theme-provider";
import { useI18n } from "../lib/i18n-provider";

const MARQUEE = [
  "expressive digital worlds",
  "websites",
  "3D characters",
  "web3 products",
  "games",
  "AI prototypes",
];

export default function StudioHero() {
  const { theme } = useTheme();
  const { t } = useI18n();
  const k = (key: string) => t(`wotori.studio.${key}`);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  // Fullscreen "burst simulator": the whole hero section goes fullscreen and
  // CSS hides the copy/nav/terminal, leaving just the clickable scene.
  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const el = sectionRef.current as
      | (HTMLElement & { webkitRequestFullscreen?: () => void })
      | null;
    if (!el) return;
    const doc = document as Document & { webkitExitFullscreen?: () => void };
    if (document.fullscreenElement) {
      if (document.exitFullscreen) void document.exitFullscreen();
      else doc.webkitExitFullscreen?.();
    } else if (el.requestFullscreen) {
      void el.requestFullscreen();
    } else {
      el.webkitRequestFullscreen?.();
    }
  };

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
      return undefined;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > window.innerHeight * 1.2) return;
        if (copyRef.current) {
          copyRef.current.style.transform = `translate3d(0, ${y * 0.22}px, 0)`;
          copyRef.current.style.opacity = String(Math.max(0, 1 - y / 560));
        }
        if (sceneRef.current) {
          sceneRef.current.style.transform = `translate3d(0, ${y * 0.1}px, 0) scale(${1 + y * 0.00018})`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      className={`ws-hero ${fullscreen ? "ws-hero--fs" : ""}`.trim()}
      id="top"
      ref={sectionRef}
    >
      <div className="ws-hero__scene" ref={sceneRef} aria-hidden="true">
        <Suspense fallback={null}>
          <VoxelScene theme={theme === "light" ? "day" : "night"} />
        </Suspense>
      </div>

      <div className="ws-hero__scrim" aria-hidden="true" />
      <div className="ws-grain" aria-hidden="true" />

      <header className="ws-topbar">
        <a className="ws-wordmark" href="#top">
          wotori<span>.io</span>
        </a>
        <nav className="ws-nav" aria-label="Primary">
          <a href="#manifesto">{k("hero.navStudio")}</a>
          <a href="#services">{k("hero.navServices")}</a>
          <a href="#work">{k("hero.navWork")}</a>
          <a className="ws-nav__cta" href="#contact">
            {k("hero.ctaPrimary")}
          </a>
        </nav>
      </header>

      <div className="ws-hero__copy" ref={copyRef}>
        <p className="ws-eyebrow">
          <span className="ws-dot" />
          {k("hero.eyebrow")}
        </p>
        <h1 className="ws-hero__title">
          {k("hero.titleA")} <span>{k("hero.titleB")}</span>
        </h1>
        <p className="ws-hero__tag">{k("hero.tag")}</p>
        <p className="ws-hero__lede">{k("hero.lede")}</p>
        <div className="ws-hero__actions">
          <a className="ws-btn ws-btn--primary" href="#contact">
            {k("hero.ctaPrimary")}
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a className="ws-btn ws-btn--ghost" href="#work">
            {k("hero.ctaSecondary")}
          </a>
        </div>
      </div>

      <StudioTerminal />

      <button
        type="button"
        className="ws-hero__fs"
        onClick={toggleFullscreen}
        aria-label={fullscreen ? k("hero.exitFullscreen") : k("hero.fullscreen")}
        title={fullscreen ? k("hero.exitFullscreen") : k("hero.fullscreen")}
      >
        {fullscreen ? (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        <span>{fullscreen ? k("hero.exitFullscreen") : k("hero.fullscreen")}</span>
      </button>

      <div className="ws-hero__foot">
        <Marquee items={MARQUEE} />
      </div>
    </section>
  );
}
