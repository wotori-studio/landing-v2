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

export const metadata: Metadata = {
  title: "Ekza Space",
  description: "GitHub for 3D artists",
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
      </head>
      <body className="min-h-screen bg-ekza-bg font-ekza text-ekza-on antialiased">
        <Providers>{children}</Providers>
        <AnalyticsTracker />
        <Analytics />
      </body>
    </html>
  );
}
