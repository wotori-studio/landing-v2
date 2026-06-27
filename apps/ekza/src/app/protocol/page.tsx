import type { Metadata } from "next";
import { ProtocolView } from "../../components/views/protocol-view";

export const metadata: Metadata = {
  title: "Stellar — the protocol of collective creation",
  description:
    "Stellar is the protocol behind Ekza: create assets together with lineage, releases, vaults, and contributor revenue shares on Solana. Designed to be used far beyond Ekza.",
  alternates: { canonical: "/protocol" },
};

export default function ProtocolPage() {
  return <ProtocolView />;
}
