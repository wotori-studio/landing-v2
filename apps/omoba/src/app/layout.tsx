import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Orbitron, Plus_Jakarta_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  title: "O-MOBA — The Open MOBA Ecosystem",
  description:
    "Open-source blockchain-based MOBA with an open economy and creator-owned content.",
  metadataBase: new URL("https://omoba.io"),
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
      <body className="font-sans">
        {children}
        <AnalyticsTracker />
        <Analytics />
      </body>
    </html>
  );
}
