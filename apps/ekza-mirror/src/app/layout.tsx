import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { AnalyticsTracker } from "@repo/analytics";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-mirror-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-mirror-sans",
  display: "swap",
});

const mirrorTitle = "Ekza Mirror | Wear the universe — AR avatars on iPhone";
const mirrorDescription =
  "Ekza Mirror is a native iPhone AR playground. Point the camera at a friend, they become an Ekza avatar, hit record. ARKit body tracking, fully on-device — camera frames never leave the phone.";
const mirrorUrl = "https://mirror.ekza.io";

export const metadata: Metadata = {
  metadataBase: new URL(mirrorUrl),
  title: mirrorTitle,
  applicationName: "Ekza Mirror",
  description: mirrorDescription,
  keywords: [
    "Ekza Mirror",
    "AR avatars",
    "ARKit body tracking",
    "RealityKit",
    "iPhone AR app",
    "on-device AR",
    "VRM avatars",
    "portable 3D identity",
    "Ekza ecosystem",
    "Wotori Studio",
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
    url: mirrorUrl,
    siteName: "Ekza Mirror",
    title: mirrorTitle,
    description: mirrorDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Ekza Mirror social preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@EkzaSpace",
    creator: "@EkzaSpace",
    title: mirrorTitle,
    description: mirrorDescription,
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
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#07080A" />
        <Script
          id="ekza-mirror-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Ekza Mirror",
                url: mirrorUrl,
                description: mirrorDescription,
                sameAs: [
                  "https://ekza.io",
                  "https://avatar.ekza.io",
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
                "@type": "MobileApplication",
                name: "Ekza Mirror",
                url: mirrorUrl,
                description: mirrorDescription,
                applicationCategory: "EntertainmentApplication",
                operatingSystem: "iOS 17+",
                publisher: {
                  "@type": "Organization",
                  name: "Wotori Studio",
                  url: "https://wotori.io",
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
