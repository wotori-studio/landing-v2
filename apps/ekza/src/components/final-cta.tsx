"use client";

import React from "react";
import { useI18n } from "../lib/i18n-provider";
import { Reveal } from "./motion";
import { NewsletterForm } from "./newsletter-form";

interface SecondaryLink {
  label: string;
  href?: string;
  onClick?: () => void;
  external?: boolean;
}

interface FinalCtaProps {
  id?: string;
  headline?: string;
  subcopy?: string;
  primaryLabel?: string;
  // If primaryHref is set, render a link; otherwise a button calling onPrimary.
  primaryHref?: string;
  primaryExternal?: boolean;
  onPrimary?: () => void;
  secondary?: SecondaryLink[];
  showNewsletter?: boolean;
}

const DEFAULT_COMMUNITY: SecondaryLink[] = [
  { label: "Discord", href: "https://discord.gg/yUWb4Q5b", external: true },
  { label: "X", href: "https://twitter.com/EkzaSpace", external: true },
  { label: "Telegram", href: "https://t.me/ekzaspace", external: true },
];

export function FinalCta({
  id = "cta",
  headline,
  subcopy,
  primaryLabel,
  primaryHref,
  primaryExternal,
  onPrimary,
  secondary,
  showNewsletter = true,
}: FinalCtaProps = {}) {
  const { t } = useI18n();

  const resolvedHeadline = headline ?? t("ekza.v2.cta.headline");
  const resolvedSubcopy = subcopy ?? t("ekza.v2.cta.subcopy");
  const resolvedPrimary = primaryLabel ?? t("ekza.v2.cta.joinWaitlist");
  const resolvedSecondary = secondary ?? DEFAULT_COMMUNITY;

  const primaryClasses =
    "rounded-full bg-ekza-primary px-8 py-3.5 text-sm font-semibold tracking-wide text-ekza-on-primary shadow-lg shadow-ekza-primary/25 transition hover:-translate-y-0.5 hover:shadow-ekza-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-ekza-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ekza-bg dark:bg-gradient-to-r dark:from-[#00d1ff] dark:to-[#7701d0] dark:text-[#003543] dark:shadow-[0_0_24px_rgba(0,209,255,0.35)] dark:focus-visible:ring-offset-black";

  return (
    <section
      id={id}
      className="relative overflow-hidden border-t border-ekza-border/20 bg-ekza-muted py-24 dark:border-white/10 dark:bg-[#111417]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50 dark:opacity-100"
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-b from-ekza-primary/5 via-transparent to-transparent dark:from-cyan-500/10" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-4xl font-bold tracking-tight text-ekza-on dark:text-white md:text-5xl">
            {resolvedHeadline}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg font-light text-ekza-on-muted dark:text-white/70">
            {resolvedSubcopy}
          </p>

          <div className="mt-9 flex flex-col items-center gap-5">
            {primaryHref ? (
              <a
                href={primaryHref}
                target={primaryExternal ? "_blank" : undefined}
                rel={primaryExternal ? "noopener noreferrer" : undefined}
                className={primaryClasses}
              >
                {resolvedPrimary}
              </a>
            ) : (
              <button onClick={onPrimary} className={primaryClasses}>
                {resolvedPrimary}
              </button>
            )}

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {resolvedSecondary.map((item) =>
                item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="text-sm font-medium text-ekza-on-muted transition hover:text-ekza-primary dark:text-white/70 dark:hover:text-cyan-300"
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="text-sm font-medium text-ekza-on-muted transition hover:text-ekza-primary dark:text-white/70 dark:hover:text-cyan-300"
                  >
                    {item.label}
                  </button>
                )
              )}
            </div>
          </div>
        </Reveal>

        {showNewsletter && (
          <Reveal
            delay={80}
            className="mx-auto mt-14 max-w-2xl rounded-[2rem] border border-ekza-primary/20 bg-ekza-primary-muted/40 p-10 dark:border-cyan-500/20 dark:bg-cyan-950/20 md:p-12"
          >
            <h3 className="text-center font-headline text-2xl font-bold text-ekza-on dark:text-white md:text-3xl">
              {t("ekza.newsletter.heading")}
            </h3>
            <p className="mx-auto mt-3 max-w-md text-center text-ekza-on-muted dark:text-white/70">
              {t("ekza.newsletter.description")}
            </p>
            <div className="mt-8">
              <NewsletterForm />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export default FinalCta;
