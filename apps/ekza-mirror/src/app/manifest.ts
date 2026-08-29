import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ekza Mirror — Wear the universe",
    short_name: "Ekza Mirror",
    description:
      "Full-body AR avatars on iPhone, fully on-device. Join the private beta before the App Store release.",
    start_url: "/",
    display: "standalone",
    background_color: "#07080A",
    theme_color: "#07080A",
    lang: "en",
    categories: ["entertainment", "photo", "technology"],
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
