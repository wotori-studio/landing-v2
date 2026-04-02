import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import { Manrope, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AnalyticsTracker } from "@repo/analytics";
import { Providers } from "./providers";
import { countryToPreferredLanguage } from "../lib/geo-language";
import { WOTORI_LANGUAGE_STORAGE_KEY } from "../lib/i18n-constants";
import {
  WOTORI_CONTACT_EMAIL,
  WOTORI_KEYWORDS,
  WOTORI_SITE_DESCRIPTION,
  WOTORI_SITE_NAME,
  WOTORI_SITE_TITLE,
  WOTORI_SITE_URL,
  WOTORI_SOCIAL_LINKS,
} from "../lib/seo";
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
  metadataBase: new URL(WOTORI_SITE_URL),
  title: {
    default: WOTORI_SITE_NAME,
    template: "%s | Wotori Studio",
  },
  applicationName: WOTORI_SITE_NAME,
  description: WOTORI_SITE_DESCRIPTION,
  keywords: [...WOTORI_KEYWORDS],
  authors: [{ name: WOTORI_SITE_NAME, url: WOTORI_SITE_URL }],
  creator: WOTORI_SITE_NAME,
  publisher: WOTORI_SITE_NAME,
  category: "technology",
  manifest: "/manifest.webmanifest",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: WOTORI_SITE_NAME,
  },
  icons: {
    icon: [{ url: "/icon", type: "image/png" }],
    apple: [{ url: "/apple-icon", type: "image/png" }],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: WOTORI_SITE_URL,
    siteName: WOTORI_SITE_NAME,
    title: WOTORI_SITE_TITLE,
    description: WOTORI_SITE_DESCRIPTION,
    locale: "en_US",
    alternateLocale: ["ru_RU", "zh_CN"],
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${WOTORI_SITE_NAME} social preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: WOTORI_SITE_TITLE,
    description: WOTORI_SITE_DESCRIPTION,
    images: ["/twitter-image"],
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
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
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: WOTORI_SITE_NAME,
      url: WOTORI_SITE_URL,
      description: WOTORI_SITE_DESCRIPTION,
      email: WOTORI_CONTACT_EMAIL,
      sameAs: [...WOTORI_SOCIAL_LINKS],
      knowsAbout: [
        "Web3 animation",
        "Creative production",
        "Solana ecosystems",
        "Creator platforms",
        "Digital ownership",
        "Gaming",
      ],
      subOrganization: [
        {
          "@type": "Organization",
          name: "Ekza Space",
          url: "https://ekza.io",
        },
        {
          "@type": "Organization",
          name: "Omoba",
          url: "https://omoba.io",
        },
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "business inquiries",
        email: WOTORI_CONTACT_EMAIL,
        availableLanguage: ["English", "Russian", "Chinese"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: WOTORI_SITE_NAME,
      url: WOTORI_SITE_URL,
      description: WOTORI_SITE_DESCRIPTION,
      inLanguage: ["en", "ru", "zh"],
      publisher: {
        "@type": "Organization",
        name: WOTORI_SITE_NAME,
        url: WOTORI_SITE_URL,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: WOTORI_SITE_TITLE,
      url: WOTORI_SITE_URL,
      description: WOTORI_SITE_DESCRIPTION,
      isPartOf: {
        "@type": "WebSite",
        name: WOTORI_SITE_NAME,
        url: WOTORI_SITE_URL,
      },
      hasPart: [
        {
          "@type": "WebPage",
          name: "Ekza Space",
          url: "https://ekza.io",
        },
        {
          "@type": "WebPage",
          name: "Omoba",
          url: "https://omoba.io",
        },
      ],
    },
  ];

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
        <Script
          id="wotori-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
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
