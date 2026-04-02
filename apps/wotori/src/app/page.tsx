import type { Metadata } from "next";
import WotoriHomePage from "../components/wotori-home-page";
import {
  WOTORI_KEYWORDS,
  WOTORI_SITE_DESCRIPTION,
  WOTORI_SITE_NAME,
  WOTORI_SITE_TITLE,
  WOTORI_SITE_URL,
} from "../lib/seo";

export const metadata: Metadata = {
  title: WOTORI_SITE_TITLE,
  description: WOTORI_SITE_DESCRIPTION,
  keywords: [...WOTORI_KEYWORDS],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: WOTORI_SITE_URL,
    siteName: WOTORI_SITE_NAME,
    title: WOTORI_SITE_TITLE,
    description: WOTORI_SITE_DESCRIPTION,
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
};

export default function WotoriLandingPage() {
  return <WotoriHomePage />;
}
