"use client";

import { useEffect } from "react";
import Footer from "../components/footer";
import { SayHi } from "../components/say-hi";
import Channels from "../components/channels";
import Intro from "../components/intro";
import Resources from "../components/resources";
import StarsAnimation from "../components/stars-animation";
import LanguageSwitcher from "../components/language-switcher";
import { useI18n } from "../lib/i18n-provider";

export default function WotoriLandingPage() {
  const { language, t } = useI18n();

  useEffect(() => {
    document.title = t("meta.wotoriTitle");
  }, [language, t]);

  return (
    <main className="overflow-x-hidden">
      <SayHi />
      <StarsAnimation />
      <div className="fixed right-4 top-4 z-50">
        <LanguageSwitcher className="border-cyan-300/70 bg-black/80 text-white shadow-[0_12px_30px_rgba(0,0,0,0.45)] hover:bg-black" />
      </div>

      <Intro />
      <Resources />
      <Channels />

      <Footer position="relative" brand="Wotori Studio" />
    </main>
  );
}
