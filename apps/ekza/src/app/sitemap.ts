import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: "https://ekza.io",
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://ekza.io/protocol",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://ekza.io/developers",
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
