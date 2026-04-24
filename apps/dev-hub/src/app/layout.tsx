import type { Metadata } from "next";
import "./globals.css";

const devHubTitle = "Dev hub | landing-v2";
const devHubDescription = "Local links to monorepo apps";
const devHubUrl = process.env.NEXT_PUBLIC_DEV_HUB_URL ?? "http://localhost:3999";

export const metadata: Metadata = {
  metadataBase: new URL(devHubUrl),
  title: devHubTitle,
  description: devHubDescription,
  openGraph: {
    type: "website",
    url: devHubUrl,
    siteName: "Dev hub",
    title: devHubTitle,
    description: devHubDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Dev hub social preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: devHubTitle,
    description: devHubDescription,
    images: ["/twitter-image"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
