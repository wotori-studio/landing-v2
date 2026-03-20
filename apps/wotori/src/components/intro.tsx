"use client";

import { useI18n } from "../lib/i18n-provider";

export default function Intro() {
  const { t } = useI18n();

  return (
    <section className="h-screen w-full flex items-center justify-center sm:mb-24 px-6">
      <div className="max-w-3xl max-sm:m-8 sm:m-8">
        <img className="w-64" src="/img/wotori.png" alt="Cat" />
        <h1 className="text-4xl font-bold mb-3">
          {t("wotori.intro.title")}
        </h1>
        <h2 className="text-2xl sm:text-3xl mb-4">
          {t("wotori.intro.subtitle")}
        </h2>
        <p className="text-xl sm:text-2xl">
          {t("wotori.intro.description")}
        </p>
      </div>
    </section>
  );
}
