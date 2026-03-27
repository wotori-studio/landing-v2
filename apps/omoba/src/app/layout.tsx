import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Orbitron, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { AnalyticsTracker } from "@repo/analytics";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-omoba-display",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-omoba-sans",
  display: "swap",
});

const omobaTitle = "Omoba | Open Source Solana MOBA Startup";
const omobaDescription =
  "Omoba is an open source Solana startup building an open MOBA ecosystem with creator-owned assets, custom avatars, and web3-native game economies.";
const omobaUrl = "https://omoba.io";

export const metadata: Metadata = {
  metadataBase: new URL(omobaUrl),
  title: omobaTitle,
  applicationName: "Omoba",
  description: omobaDescription,
  keywords: [
    "Omoba",
    "open source game",
    "Solana startup",
    "Solana gaming",
    "open MOBA",
    "web3 game",
    "creator-owned assets",
    "custom avatars",
    "open source MOBA",
  ],
  authors: [{ name: "Wotori Studio", url: "https://wotori.io" }],
  creator: "Wotori Studio",
  publisher: "Wotori Studio",
  category: "games",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: omobaUrl,
    siteName: "Omoba",
    title: omobaTitle,
    description: omobaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: omobaTitle,
    description: omobaDescription,
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
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${jakarta.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="omoba-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Omoba",
                url: omobaUrl,
                description: omobaDescription,
                sameAs: [
                  "https://github.com/o-moba",
                  "https://x.com/wotorimovako",
                  "https://discord.gg/De83tH6H",
                  "https://t.me/wotoristudio",
                ],
                parentOrganization: {
                  "@type": "Organization",
                  name: "Wotori Studio",
                  url: "https://wotori.io",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "VideoGame",
                name: "Omoba",
                url: omobaUrl,
                description: omobaDescription,
                genre: ["MOBA", "Web3", "Multiplayer"],
                gamePlatform: ["Web"],
                publisher: {
                  "@type": "Organization",
                  name: "Wotori Studio",
                },
              },
            ]),
          }}
        />
      </head>
      <body className="font-sans">
        {children}
        <AnalyticsTracker />
        <Analytics />
      </body>
    </html>
  );
}
