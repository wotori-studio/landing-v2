import type { MetadataRoute } from "next";
import {
  WOTORI_SITE_DESCRIPTION,
  WOTORI_SITE_NAME,
} from "../lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: WOTORI_SITE_NAME,
    short_name: "Wotori",
    description: WOTORI_SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#00e4af",
    lang: "en",
    categories: ["business", "art", "entertainment", "technology"],
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
