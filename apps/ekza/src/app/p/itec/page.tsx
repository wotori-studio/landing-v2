import type { Metadata } from "next";
import { ProgramPage } from "../../../components/program-page";

export const metadata: Metadata = {
  title: "Ekza — ITEC 2026 Beijing",
  description:
    "Ekza application for ITEC 2026 (Chaoyang, Beijing) — AI · Digital Culture · Gaming.",
  robots: { index: false, follow: false },
};

export default function ItecProgramPage() {
  return (
    <ProgramPage
      eyebrow="ITEC 2026 · International Track · Beijing Chaoyang"
      headline="Create once. Own it. Play it across games."
      oneLiner="Ekza combines AI-assisted 3D creation, a persistent player profile and partner integrations."
      body="One owned avatar or asset gets approved, game-ready versions across multiple titles — starting with Cocos Creator on Weixin Mini Games and Tuanjie for Douyin. Chaoyang is the landing route: local game partners, 3D production capacity and paid proof-of-concept integrations."
      deckHtmlHref="/decks/ekza_itec_beijing_2026.html"
      deckPdfHref="/decks/ekza_itec_beijing_2026.pdf"
      links={[
        { label: "ekza.io", href: "/" },
        {
          label: "Omoba",
          href: "https://omoba.io",
          external: true,
        },
        {
          label: "Wotori Studio",
          href: "https://wotori.io",
          external: true,
        },
      ]}
    />
  );
}
