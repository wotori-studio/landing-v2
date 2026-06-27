import type { Metadata } from "next";
import { HomeView } from "../components/views/home-view";

export const metadata: Metadata = {
  title: "Ekza — A universe built together",
  description:
    "Ekza is a universe of collective creation. Stellar lets you create and own what you make; Ekza Space is where it comes alive — numbered 3D places you hold on-chain. Own the first piece: a Space on Solana.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeView />;
}
