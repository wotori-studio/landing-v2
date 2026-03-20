import type { Metadata } from "next";
import { I18nProvider } from "../lib/i18n-provider";
import { AnalyticsTracker } from "@repo/analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ekza Space",
  description: "GitHub for 3D artists",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>{children}</I18nProvider>
        <AnalyticsTracker />
      </body>
    </html>
  );
}
