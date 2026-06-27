import { SayHi } from "@/components/say-hi";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { SectionEvolution } from "@/components/section-evolution";
import { SectionCreators } from "@/components/section-creators";
import { SectionWeb3 } from "@/components/section-web3";
import { SectionRoadmap } from "@/components/section-roadmap";
import { SectionEcosystem } from "@/components/section-ecosystem";
import { SectionCta } from "@/components/section-cta";
import { SiteFooter } from "@/components/site-footer";
import { AnimReady, Marquee } from "@/components/motion";

const MARQUEE = [
  "open source",
  "creator-owned",
  "Solana",
  "DAO governed",
  "UGC heroes",
  "true ownership",
  "lane-pushing depth",
];

export default function OmobaLandingPage() {
  return (
    <>
      <SayHi />
      <AnimReady />
      <SiteHeader />
      <main>
        <HeroSection />
        <Marquee items={MARQUEE} />
        <SectionEvolution />
        <SectionCreators />
        <SectionWeb3 />
        <SectionRoadmap />
        <SectionEcosystem />
        <SectionCta />
      </main>
      <SiteFooter />
    </>
  );
}
