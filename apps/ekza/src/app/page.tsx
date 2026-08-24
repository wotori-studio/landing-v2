import type { Metadata } from "next";
import { HomeView } from "../components/views/home-view";

export const metadata: Metadata = {
  title: "Ekza — Own what you make, together",
  description:
    "Ekza is the ownership layer for collaboratively made 3D assets: lineage, licensing, and automatic revenue sharing for every contributor. The model is rail-agnostic — it runs on Solana today and works over conventional payments too.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeView />;
}
