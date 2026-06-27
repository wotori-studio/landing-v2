"use client";

import React, { useEffect, useState, type ReactNode } from "react";
import { Reveal } from "./motion";

interface Button {
  text: string;
  link?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "link";
}

interface HeroSectionProps {
  imageUrl: string;
  imageAlt?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  quoteEyebrow?: string;
  quote?: string;
  footerLeft?: string;
  footerCenter?: string;
  buttons?: Button[];
  heroHeight?: string;
  rightVisual?: ReactNode;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  imageUrl,
  imageAlt = "Ekza Space — virtual worlds owned on-chain",
  title = "Ekza Space",
  subtitle = "Where creativity runs free",
  description = "",
  quoteEyebrow,
  quote,
  footerLeft = "",
  footerCenter = "Ekza Space ©2025",
  buttons = [{ text: "Start Exploring", link: "#", variant: "primary" }],
  heroHeight = "min-h-screen",
  rightVisual,
}) => {
  // Light scroll parallax (mirrors omoba/wotori heroes), reduced-motion aware.
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => setOffset(Math.min(window.scrollY, 320));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getButtonClasses = (variant: Button["variant"] = "primary") => {
    const base =
      "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ekza-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ekza-bg dark:focus-visible:ring-offset-black";

    if (variant === "primary") {
      return `${base} bg-ekza-primary text-ekza-on-primary shadow-lg shadow-ekza-primary/25 hover:-translate-y-0.5 hover:shadow-ekza-glow dark:bg-gradient-to-r dark:from-[#00d1ff] dark:to-[#7701d0] dark:text-[#003543] dark:shadow-[0_0_24px_rgba(0,209,255,0.35)]`;
    }

    return `${base} border border-ekza-border/60 bg-ekza-elevated/90 text-ekza-on hover:bg-ekza-muted dark:border-white/15 dark:bg-white/10 dark:text-white dark:backdrop-blur-md dark:hover:bg-white/15`;
  };

  const renderButton = (button: Button, index: number) => {
    // Tertiary action = plain underlined text link, not a pill.
    if (button.variant === "link") {
      return (
        <a
          key={index}
          href={button.link}
          onClick={button.onClick}
          target={button.link?.startsWith("http") ? "_blank" : undefined}
          rel={button.link?.startsWith("http") ? "noopener noreferrer" : undefined}
          className="link inline-flex items-center gap-1 self-center text-sm font-semibold"
        >
          {button.text}
          <span aria-hidden>→</span>
        </a>
      );
    }

    if (button.onClick) {
      return (
        <button
          key={index}
          onClick={button.onClick}
          className={getButtonClasses(button.variant)}
        >
          {button.text}
        </button>
      );
    }

    return (
      <a
        key={index}
        href={button.link}
        target={button.link?.startsWith("http") ? "_blank" : undefined}
        rel={button.link?.startsWith("http") ? "noopener noreferrer" : undefined}
        className={getButtonClasses(button.variant)}
      >
        {button.text}
      </a>
    );
  };

  return (
    <section
      id="hero"
      className={`relative w-full ${heroHeight} overflow-hidden text-ekza-on dark:text-white`}
    >
      {/* Background layer — present in BOTH themes */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* Ambient orbs (theme-tuned) */}
        <div
          className="ekza-glow-orb bg-ekza-primary/70 -left-48 -top-48 h-[500px] w-[500px] dark:bg-cyan-400"
          style={{ transform: `translateY(${offset * 0.1}px)` }}
        />
        <div
          className="ekza-glow-orb bg-ekza-accent/60 right-[-16rem] top-1/3 h-[600px] w-[600px] dark:bg-purple-600"
          style={{ transform: `translateY(${offset * 0.06}px)` }}
        />
        <div
          className="ekza-glow-orb bottom-0 left-1/4 hidden h-[400px] w-[400px] bg-fuchsia-400 opacity-[0.1] dark:block"
          style={{ transform: `translateY(${-offset * 0.05}px)` }}
        />

        {/* Space photo */}
        <img
          className="absolute inset-0 h-full w-full object-cover object-center opacity-70 dark:opacity-100"
          src={imageUrl}
          alt={imageAlt}
          loading="eager"
          decoding="async"
          style={{ transform: `translateY(${offset * 0.1}px) scale(1.08)` }}
        />

        {/* Vertical scrim — bright/ethereal in light, deep void in dark */}
        <div className="absolute inset-0 bg-gradient-to-b from-ekza-bg/85 via-ekza-bg/65 to-ekza-bg/90 dark:from-black/75 dark:via-black/35 dark:to-black/45" />
        {/* Left-edge legibility scrim */}
        <div className="absolute inset-0 bg-gradient-to-r from-ekza-bg/90 via-ekza-bg/40 to-transparent dark:from-black/55 dark:via-transparent dark:to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-[inherit] flex-col px-6 py-10 sm:px-8 sm:py-12 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-12 lg:gap-16">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left column — narrative + actions */}
            <div className="space-y-6 lg:col-span-7">
              {quoteEyebrow && (
                <Reveal
                  as="p"
                  className="font-headline text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90"
                >
                  {quoteEyebrow}
                </Reveal>
              )}
              <Reveal
                as="h1"
                delay={80}
                className="font-headline text-4xl font-bold leading-[1.05] tracking-tight text-ekza-on dark:text-white sm:text-5xl md:text-6xl lg:text-7xl"
              >
                {title}
              </Reveal>
              {subtitle && (
                <Reveal
                  as="p"
                  delay={160}
                  className="max-w-xl text-lg font-light leading-relaxed text-ekza-on-muted dark:text-white/85 md:text-xl"
                >
                  {subtitle}
                </Reveal>
              )}

              {/* CTAs — directly under the value proposition */}
              <Reveal
                delay={240}
                className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center"
              >
                {buttons.map(renderButton)}
              </Reveal>

              {description && (
                <Reveal
                  as="p"
                  delay={300}
                  className="max-w-xl text-sm leading-relaxed text-ekza-on-muted dark:text-white/75 md:text-base"
                >
                  {description}
                </Reveal>
              )}

              {quote && (
                <Reveal
                  as="blockquote"
                  delay={320}
                  className="relative max-w-xl border-l-2 border-ekza-primary/50 py-1 pl-5 text-base italic leading-relaxed text-ekza-on-muted dark:border-cyan-400/50 dark:text-white/80"
                >
                  {quote}
                </Reveal>
              )}
            </div>

            {/* Right column — single focal visual (shown on mobile too) */}
            {rightVisual && (
              <Reveal
                delay={320}
                className="mt-10 lg:col-span-5 lg:mt-0"
              >
                <div
                  className="mx-auto max-w-sm lg:max-w-md"
                  style={{ transform: `translateY(${-offset * 0.05}px)` }}
                >
                  {rightVisual}
                </div>
              </Reveal>
            )}
          </div>
        </div>

        <footer className="mx-auto mt-auto w-full max-w-7xl flex-shrink-0 border-t border-ekza-border/25 pt-4 dark:border-white/15">
          <div className="flex flex-col justify-between gap-2 text-sm text-ekza-on-muted dark:text-white/55 sm:flex-row sm:items-center">
            <span>{footerLeft}</span>
            <span className="font-medium tracking-wide">{footerCenter}</span>
          </div>
        </footer>
      </div>
    </section>
  );
};
