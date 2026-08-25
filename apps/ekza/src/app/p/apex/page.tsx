import type { Metadata } from "next";
import { ProgramPage } from "../../../components/program-page";

export const metadata: Metadata = {
  title: "EKZA — Apex Accelerator 2026",
  description:
    "EKZA application for the Apex Accelerator by Draper University × Draper Dragon × Cardano.",
  robots: { index: false, follow: false },
};

export default function ApexProgramPage() {
  return (
    <ProgramPage
      eyebrow="Apex Accelerator · DraperU × Draper Dragon × Cardano"
      headline="Create once. Verify rights. Activate across games."
      oneLiner="EKZA turns AI-assisted 3D characters into licensed, game-ready digital IP."
      body="Cardano records origin, permissions and payouts; EKZA delivers an approved rendition to each game. Four open-source programs already prove the asset model on a working devnet — the architecture is rail-agnostic, and Apex is the ten-week milestone to make Cardano the primary production rights rail."
      deckHtmlHref="/decks/ekza_apex_cardano_2026.html"
      deckPdfHref="/decks/ekza_apex_cardano_2026.pdf"
      links={[
        { label: "ekza.io", href: "/" },
        { label: "Protocol", href: "/protocol" },
        { label: "Developers", href: "/developers" },
        {
          label: "GitHub",
          href: "https://github.com/ekza-space",
          external: true,
        },
      ]}
    />
  );
}
