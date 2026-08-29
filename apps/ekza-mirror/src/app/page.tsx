import { SayHi } from "@/components/say-hi";
import { AnimReady, Marquee } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { SectionSteps } from "@/components/section-steps";
import { SectionAvatars } from "@/components/section-avatars";
import { SectionLens } from "@/components/section-lens";
import { SectionTech } from "@/components/section-tech";
import { SectionRoadmap } from "@/components/section-roadmap";
import { SectionFaq } from "@/components/section-faq";
import { SectionCta } from "@/components/section-cta";
import { SiteFooter } from "@/components/site-footer";
import { Noise } from "@/components/noise";

const MARQUEE = [
  "point",
  "wear",
  "record",
  "wear the universe",
  "on-device",
  "arkit body tracking",
  "portable identity",
  "iphone only",
];

export default function EkzaMirrorLandingPage() {
  return (
    <div className="mir-mesh relative min-h-screen overflow-x-clip">
      <Noise fixed className="hidden lg:block" />
      <SayHi />
      <AnimReady />
      <SiteHeader />
      <main>
        <HeroSection />
        <Marquee items={MARQUEE} />
        <SectionSteps />
        <SectionAvatars />
        <SectionLens />
        <SectionTech />
        <SectionRoadmap />
        <SectionFaq />
        <SectionCta />
      </main>
      <SiteFooter />
    </div>
  );
}
