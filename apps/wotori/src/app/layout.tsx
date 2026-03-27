import type { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import { Manrope, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AnalyticsTracker } from "@repo/analytics";
import { Providers } from "./providers";
import { countryToPreferredLanguage } from "../lib/geo-language";
import { WOTORI_LANGUAGE_STORAGE_KEY } from "../lib/i18n-constants";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-wotori-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-wotori-headline",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wotori.io"),
  title: "Wotori Studio",
  description:
    "Wotori Studio is a decentralized animation and production studio building creator-first platforms, media, and digital ownership ecosystems for web3.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://wotori.io",
    siteName: "Wotori Studio",
    title: "Wotori Studio",
    description:
      "Wotori Studio is a decentralized animation and production studio building creator-first platforms, media, and digital ownership ecosystems for web3.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wotori Studio",
    description:
      "Wotori Studio is a decentralized animation and production studio building creator-first platforms, media, and digital ownership ecosystems for web3.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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

  const themeInitScript = `(function(){try{var s=localStorage.getItem('wotori-theme');if(s==='dark'||s==='light'){if(s==='dark')document.documentElement.classList.add('dark');}else{var h=new Date().getHours();if(h>=19||h<7)document.documentElement.classList.add('dark');}}catch(e){}})();`;

  return (
    <html
      lang={geoDefaultLanguage}
      className={`${manrope.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-slate-50 font-wotori text-slate-900 antialiased dark:bg-black dark:text-white">
        <Script
          id="wotori-i18n-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: i18nInitScript }}
        />
        <Script
          id="wotori-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <Providers geoDefaultLanguage={geoDefaultLanguage}>
          {children}
        </Providers>
        <AnalyticsTracker />
        <Analytics />
      </body>
    </html>
  );
}
