import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/p/", "/decks/"],
      },
    ],
    sitemap: "https://ekza.io/sitemap.xml",
  };
}
