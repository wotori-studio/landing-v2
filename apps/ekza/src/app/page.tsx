import type { Metadata } from "next";
import { HomeView } from "../components/views/home-view";

export const metadata: Metadata = {
  title: "Ekza — Own what you make, together",
  description:
    "Ekza is the ownership layer for collaboratively made 3D assets: lineage, licensing, and automatic revenue sharing for every contributor. Blockchain is the settlement rail — the product is trusted collaboration.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeView />;
}
