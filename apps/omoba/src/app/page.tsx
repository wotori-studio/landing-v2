import { SayHi } from "@/components/say-hi";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { SectionEvolution } from "@/components/section-evolution";
import { SectionCreators } from "@/components/section-creators";
import { SectionWeb3 } from "@/components/section-web3";
import { SectionEcosystem } from "@/components/section-ecosystem";
import { SiteFooter } from "@/components/site-footer";

export default function OmobaLandingPage() {
  return (
    <>
      <SayHi />
      <SiteHeader />
      <main>
        <HeroSection />
        <SectionEvolution />
        <SectionCreators />
        <SectionWeb3 />
        <SectionEcosystem />
      </main>
      <SiteFooter />
    </>
  );
}
