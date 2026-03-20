"use client";

import { useI18n } from "../lib/i18n-provider";

export default function Resources() {
  const { t } = useI18n();

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
      href: "https://x.com/wotorimovako",
      cta: t("wotori.portfolio.projects.omoba.cta"),
    },
    {
      name: t("wotori.portfolio.projects.opusprism.name"),
      description: t("wotori.portfolio.projects.opusprism.description"),
      href: "https://opusprism.app",
      cta: t("wotori.portfolio.projects.opusprism.cta"),
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
    <section className="bg-gray-100 py-20 sm:mb-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-3">
            {t("wotori.portfolio.label")}
          </p>
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            {t("wotori.portfolio.heading")}
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl">
            {t("wotori.portfolio.description")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-20">
          {projects.map((project) => (
            <article
              key={project.name}
              className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200"
            >
              <h3 className="text-2xl font-semibold mb-3">{project.name}</h3>
              <p className="text-gray-700 leading-relaxed mb-5">
                {project.description}
              </p>
              <a
                className="link font-medium"
                target="_blank"
                rel="noopener noreferrer"
                href={project.href}
              >
                {project.cta}
              </a>
            </article>
          ))}
        </div>

        <div id="investors">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-3">
            {t("wotori.investors.label")}
          </p>
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            {t("wotori.investors.heading")}
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mb-8">
            {t("wotori.investors.description")}
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {investorResources.map((resource) => (
              <article
                key={resource.title}
                className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200"
              >
                <h3 className="text-2xl font-semibold mb-2">{resource.title}</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {resource.text}
                </p>
                <a
                  className="link font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={resource.href}
                >
                  {resource.cta}
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
