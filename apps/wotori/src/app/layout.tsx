import type { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { AnalyticsTracker } from "@repo/analytics";
import { I18nProvider } from "../lib/i18n-provider";
import { countryToPreferredLanguage } from "../lib/geo-language";
import { WOTORI_LANGUAGE_STORAGE_KEY } from "../lib/i18n-constants";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wotori Studio",
  description: "Decentralized Animation & Production Studio",
};

/**
 * Read geo for language hint (Vercel / compatible proxies). No PII stored in layout.
 */
function getGeoDefaultLanguage(): "en" | "ru" | "zh" {
  const country = headers().get("x-vercel-ip-country");
  return countryToPreferredLanguage(country);
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const geoDefaultLanguage = getGeoDefaultLanguage();

  // Runs before React: localStorage wins if set; else geo default and persist for next visits.
  const i18nInitScript = `(function(){var K=${JSON.stringify(
    WOTORI_LANGUAGE_STORAGE_KEY
  )};function ok(x){return x==="en"||x==="ru"||x==="zh";}var s=null;try{s=localStorage.getItem(K);}catch(e){}var auto=${JSON.stringify(
    geoDefaultLanguage
  )};var lang;if(s&&ok(s))lang=s;else{lang=auto;try{localStorage.setItem(K,lang);}catch(e){}}document.documentElement.lang=lang;window.__WOTORI_INITIAL_LANG__=lang;})();`;

  return (
    <html lang={geoDefaultLanguage} suppressHydrationWarning>
      <body>
        <Script
          id="wotori-i18n-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: i18nInitScript }}
        />
        <I18nProvider geoDefaultLanguage={geoDefaultLanguage}>
          {children}
        </I18nProvider>
        <AnalyticsTracker />
        <Analytics />
      </body>
    </html>
  );
}
