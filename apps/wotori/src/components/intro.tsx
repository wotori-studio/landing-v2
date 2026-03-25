"use client";

import { useI18n } from "../lib/i18n-provider";

export default function Intro() {
  const { t } = useI18n();

  return (
    <section className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6 pb-20 pt-28 sm:px-10">
      <div className="w-full max-w-2xl">
        <div className="rounded-[2rem] border border-slate-200/50 bg-white/60 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.05)] backdrop-blur-xl transition-all duration-500 hover:bg-white/80 hover:shadow-[0_24px_80px_rgba(0,228,175,0.1)] dark:border-white/10 dark:bg-white/[0.03] dark:shadow-[0_24px_80px_rgba(0,0,0,0.6)] dark:hover:bg-white/[0.05] dark:hover:shadow-[0_24px_80px_rgba(0,228,175,0.08)] sm:p-12">
          <div className="mb-8 flex justify-center sm:mb-10">
            <img
              className="h-auto w-48 drop-shadow-[0_0_28px_rgba(0,228,175,0.35)] sm:w-56"
              src="/img/wotori.png"
              alt="Wotori Studio"
            />
          </div>
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.35em] text-wotori-accent/90">
            Wotori Studio
          </p>
          <h1 className="font-headline text-center text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
            {t("wotori.intro.title")}
          </h1>
          <div
            className="mx-auto mt-6 h-px max-w-xs bg-gradient-to-r from-transparent via-wotori-accent/80 to-transparent"
            aria-hidden
          />
          <h2 className="mt-6 text-center text-xl font-light leading-snug text-slate-700 dark:text-white/90 sm:text-2xl md:text-3xl">
            {t("wotori.intro.subtitle")}
          </h2>
          <p className="mt-8 text-center text-base leading-relaxed text-slate-600 dark:text-slate-300/95 sm:text-lg md:text-xl">
            {t("wotori.intro.description")}
          </p>
        </div>
      </div>
    </section>
  );
}
