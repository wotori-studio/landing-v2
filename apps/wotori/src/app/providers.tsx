"use client";

import { I18nProvider } from "../lib/i18n-provider";
import { ThemeProvider } from "../lib/theme-provider";

export function Providers({
  children,
  geoDefaultLanguage,
}: {
  children: React.ReactNode;
  geoDefaultLanguage: "en" | "ru" | "zh";
}) {
  return (
    <ThemeProvider>
      <I18nProvider geoDefaultLanguage={geoDefaultLanguage}>
        {children}
      </I18nProvider>
    </ThemeProvider>
  );
}
