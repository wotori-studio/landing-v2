"use client";

import { I18nProvider } from "../lib/i18n-provider";
import { ThemeProvider } from "../lib/theme-provider";
import { ReserveProvider } from "./reserve-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <ReserveProvider>{children}</ReserveProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
