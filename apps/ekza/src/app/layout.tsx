import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { AnalyticsTracker } from "@repo/analytics";
import { Providers } from "./providers";
import { SiteChrome } from "../components/site-chrome";
import Script from "next/script";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-ekza-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-ekza-headline",
  display: "swap",
});

const ekzaTitle = "Ekza | Ownership Layer for Collaborative 3D Assets";
const ekzaDescription =
  "Ekza tracks who made every 3D asset and routes revenue to each contributor when it is sold, rented, or licensed. Collaborative creation, programmable splits, and game-ready bundles — settled on Solana.";
const ekzaUrl = "https://ekza.io";

export const metadata: Metadata = {
  metadataBase: new URL(ekzaUrl),
  title: ekzaTitle,
  applicationName: "Ekza Space",
  description: ekzaDescription,
  keywords: [
    "Ekza",
    "collaborative 3D assets",
    "3D asset licensing",
    "creator royalties",
    "revenue sharing",
    "game asset SDK",
    "3D collaboration",
    "digital ownership",
    "open source Solana",
  ],
  authors: [{ name: "Wotori Studio", url: "https://wotori.io" }],
  creator: "Wotori Studio",
  publisher: "Wotori Studio",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: ekzaUrl,
    siteName: "Ekza Space",
    title: ekzaTitle,
    description: ekzaDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Ekza Space social preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ekzaTitle,
    description: ekzaDescription,
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Runs before React: localStorage wins if set; else default to dark (on-brand)
  const themeInitScript = `(function(){try{var s=localStorage.getItem('ekza-theme');if(s==='light'){document.documentElement.classList.remove('dark');}else{document.documentElement.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}})();`;

  return (
    <html
      lang="en"
      className={`${manrope.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="ekza-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <Script
          id="ekza-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Ekza Space",
                url: ekzaUrl,
                description: ekzaDescription,
                sameAs: [
                  "https://github.com/ekza-space",
                  "https://twitter.com/EkzaSpace",
                  "https://discord.gg/yUWb4Q5b",
                  "https://t.me/ekzaspace",
                ],
                parentOrganization: {
                  "@type": "Organization",
                  name: "Wotori Studio",
                  url: "https://wotori.io",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "Ekza Space",
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web",
                url: ekzaUrl,
                description: ekzaDescription,
                keywords:
                  "open source, Solana startup, 3D assets, creator royalties, web3, SDK",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                },
              },
            ]),
          }}
        />
      </head>
      <body className="min-h-screen bg-ekza-bg font-ekza text-ekza-on antialiased">
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
        <AnalyticsTracker />
        <Analytics />
      </body>
    </html>
  );
}
