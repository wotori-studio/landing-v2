"use client";

import { useI18n } from "../lib/i18n-provider";

export default function Resources() {
  const { t } = useI18n();

  /** Set `hidden: true` to temporarily hide a card without removing copy / i18n. */
  const projects = [
    {
      name: t("wotori.portfolio.projects.ekza.name"),
      description: t("wotori.portfolio.projects.ekza.description"),
      href: "https://ekza.io",
      cta: t("wotori.portfolio.projects.ekza.cta"),
    },
    {
      name: t("wotori.portfolio.projects.omoba.name"),
      description: t("wotori.portfolio.projects.omoba.description"),
      href: "https://omoba.io",
      cta: t("wotori.portfolio.projects.omoba.cta"),
    },
  ];

  const investorResources = [
    {
      title: t("wotori.investors.lightPaper.title"),
      text: t("wotori.investors.lightPaper.text"),
      href: "https://wotori.io/ppt/lp-wotori-studio_v0.5.pdf",
      cta: t("wotori.investors.lightPaper.cta"),
    },
    {
      title: t("wotori.investors.pitchdeck.title"),
      text: t("wotori.investors.pitchdeck.text"),
      href: "https://stellar.ekza.io/ppt/wotori-pitchdeck.pdf",
      cta: t("wotori.investors.pitchdeck.cta"),
    },
  ];

  return (
    <section className="relative border-y border-slate-200/50 bg-slate-50 py-24 dark:border-white/5 dark:bg-zinc-950">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-16">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-wotori-accent/90">
            {t("wotori.portfolio.label")}
          </p>
          <h2 className="font-headline text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
            {t("wotori.portfolio.heading")}
          </h2>
          <p className="mt-5 max-w-3xl text-lg font-light leading-relaxed text-slate-600 dark:text-slate-300">
            {t("wotori.portfolio.description")}
          </p>
        </div>

        <div className="mb-24 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.name}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-0 shadow-[0_20px_50px_rgba(0,0,0,0.05)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-wotori-accent/40 hover:bg-white hover:shadow-[0_28px_60px_rgba(0,228,175,0.15)] dark:border-white/10 dark:bg-white/[0.03] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] dark:hover:border-wotori-accent/30 dark:hover:bg-white/[0.06] dark:hover:shadow-[0_28px_60px_rgba(0,228,175,0.12)]"
            >
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-wotori-accent to-cyan-400 opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="p-6">
                <h3 className="font-headline text-xl font-semibold text-slate-900 dark:text-white md:text-2xl">
                  {project.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-base">
                  {project.description}
                </p>
                <a
                  className="link mt-5 inline-flex items-center gap-1 text-sm dark:link-on-dark"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={project.href}
                >
                  {project.cta}
                  <span aria-hidden className="text-xs opacity-70">
                    ↗
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>

        <div id="investors">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-wotori-accent/90">
            {t("wotori.investors.label")}
          </p>
          <h2 className="font-headline text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
            {t("wotori.investors.heading")}
          </h2>
          <p className="mt-5 max-w-3xl text-lg font-light leading-relaxed text-slate-600 dark:text-slate-300">
            {t("wotori.investors.description")}
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {investorResources.map((resource) => (
              <article
                key={resource.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-0 shadow-[0_20px_50px_rgba(0,0,0,0.05)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-wotori-accent/40 hover:bg-white hover:shadow-[0_28px_60px_rgba(0,228,175,0.15)] dark:border-white/10 dark:bg-white/[0.03] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] dark:hover:border-wotori-accent/30 dark:hover:bg-white/[0.06] dark:hover:shadow-[0_28px_60px_rgba(0,228,175,0.12)]"
              >
                <div className="h-1 w-full bg-gradient-to-r from-cyan-500/50 via-wotori-accent to-cyan-400/30 opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="p-6">
                  <h3 className="font-headline text-xl font-semibold text-slate-900 dark:text-white md:text-2xl">
                    {resource.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-base">
                    {resource.text}
                  </p>
                  <a
                    className="link mt-5 inline-flex items-center gap-1 text-sm dark:link-on-dark"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={resource.href}
                  >
                    {resource.cta}
                    <span aria-hidden className="text-xs opacity-70">
                      ↗
                    </span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
