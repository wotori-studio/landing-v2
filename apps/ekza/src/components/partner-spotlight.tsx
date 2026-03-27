"use client";

import { useI18n } from "../lib/i18n-provider";

const OMOBA_URL = "https://omoba.io";

export function PartnerSpotlight() {
  const { t } = useI18n();
  const openLabel = t("common.open");

  return (
    <section
      id="partners"
      className="border-t border-ekza-border/20 bg-ekza-surface py-20 dark:border-white/10 dark:bg-[#0c0e12]"
    >
      <div className="container mx-auto px-6 text-center">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90">
          {t("ekza.partners.label")}
        </p>
        <h2 className="font-headline text-4xl font-bold tracking-tight text-ekza-on dark:text-white md:text-5xl">
          {t("ekza.partners.heading")}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg font-light text-ekza-on-muted dark:text-white/70">
          {t("ekza.partners.description")}
        </p>

        <div className="mx-auto mt-12 max-w-xl">
          <a
            href={OMOBA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden rounded-2xl border border-ekza-border/25 bg-ekza-elevated/95 p-8 text-left shadow-ekza-card transition hover:border-ekza-primary/35 hover:shadow-[0_28px_90px_rgba(0,228,175,0.12)] dark:border-white/10 dark:bg-white/[0.05] dark:shadow-ekza-card-dark dark:hover:border-cyan-400/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-headline text-2xl font-semibold tracking-tight text-ekza-on dark:text-white md:text-3xl">
                  Omoba
                </p>
                <p className="mt-2 inline-flex rounded-full border border-ekza-primary/25 bg-ekza-primary-muted/50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ekza-on dark:border-cyan-500/30 dark:bg-cyan-950/40 dark:text-cyan-100/90">
                  {t("ekza.partners.omoba.engineBadge")}
                </p>
              </div>
              <span className="shrink-0 pt-1 text-xs uppercase tracking-[0.2em] text-ekza-on-muted dark:text-white/50">
                {openLabel}
              </span>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-ekza-on-muted dark:text-white/80 md:text-base">
              {t("ekza.partners.omoba.description")}
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}
