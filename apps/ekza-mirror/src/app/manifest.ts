import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ekza Mirror — Wear the universe",
    short_name: "Ekza Mirror",
    description:
      "A native iPhone AR playground: point the camera at a friend, they become an Ekza avatar, hit record. Fully on-device.",
    start_url: "/",
    display: "standalone",
    background_color: "#07070C",
    theme_color: "#7C5CFF",
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
