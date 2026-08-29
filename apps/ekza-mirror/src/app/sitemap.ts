import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const contentUpdatedAt = new Date("2026-08-29");

  return [
    {
      url: "https://mirror.ekza.io",
      lastModified: contentUpdatedAt,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://mirror.ekza.io/privacy",
      lastModified: contentUpdatedAt,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
