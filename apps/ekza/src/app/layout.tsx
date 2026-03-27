import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { AnalyticsTracker } from "@repo/analytics";
import { Providers } from "./providers";
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

const ekzaTitle = "Ekza Space | Open Source Solana Startup for 3D Assets";
const ekzaDescription =
  "Ekza Space is an open source Solana startup for collaborative 3D asset creation, SDK-powered game integration, and creator-owned royalty infrastructure.";
const ekzaUrl = "https://ekza.io";

export const metadata: Metadata = {
  metadataBase: new URL(ekzaUrl),
  title: ekzaTitle,
  applicationName: "Ekza Space",
  description: ekzaDescription,
  keywords: [
    "Ekza Space",
    "Solana startup",
    "open source Solana",
    "3D asset platform",
    "creator royalties",
    "game asset SDK",
    "web3 creator tools",
    "digital ownership",
    "3D collaboration",
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
  },
  twitter: {
    card: "summary_large_image",
    title: ekzaTitle,
    description: ekzaDescription,
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
  // Runs before React: localStorage wins if set; else time-based default
  const themeInitScript = `(function(){try{var s=localStorage.getItem('ekza-theme');if(s==='dark'||s==='light'){if(s==='dark')document.documentElement.classList.add('dark');}else{var h=new Date().getHours();if(h>=19||h<7)document.documentElement.classList.add('dark');}}catch(e){}})();`;

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
        <Providers>{children}</Providers>
        <AnalyticsTracker />
        <Analytics />
      </body>
    </html>
  );
}
