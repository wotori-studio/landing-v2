import type { Metadata } from "next";
import { DevelopersView } from "../../components/views/developers-view";

export const metadata: Metadata = {
  title: "Ekza for developers — open Anchor programs on Solana",
  description:
    "No black box. Ekza's on-chain layer is a set of open Anchor programs — solana_ekza_space and solana_stellar — with deterministic PDAs and emitted events you can index on Solana devnet.",
  alternates: { canonical: "/developers" },
};

export default function DevelopersPage() {
  return <DevelopersView />;
}
