"use client";

import { useEffect } from "react";
import Footer from "../components/footer";
import { SayHi } from "../components/say-hi";
import Channels from "../components/channels";
import Intro from "../components/intro";
import Resources from "../components/resources";
import StarsAnimation from "../components/stars-animation";
import LanguageSwitcher from "../components/language-switcher";
import { ThemeToggle } from "../components/theme-toggle";
import { useI18n } from "../lib/i18n-provider";

export default function WotoriLandingPage() {
  const { language, t } = useI18n();

  useEffect(() => {
    document.title = t("meta.wotoriTitle");
  }, [language, t]);

  return (
    <main className="relative overflow-x-hidden">
      <StarsAnimation />

      <div className="relative z-[1]">
        <SayHi />

        <header className="fixed left-0 right-0 top-0 z-50 flex justify-end gap-3 border-b border-slate-200/50 bg-white/30 px-4 py-3 backdrop-blur-md dark:border-white/5 dark:bg-black/20 sm:px-6">
          <ThemeToggle className="border-slate-200/80 bg-white/60 text-slate-700 shadow-[0_8px_20px_rgba(0,0,0,0.05)] hover:border-wotori-accent/40 hover:bg-white dark:border-white/20 dark:bg-black/50 dark:text-white dark:shadow-[0_12px_30px_rgba(0,0,0,0.35)] dark:hover:border-wotori-accent/40 dark:hover:bg-black/70" />
          <LanguageSwitcher className="border-slate-200/80 bg-white/60 text-slate-700 shadow-[0_8px_20px_rgba(0,0,0,0.05)] hover:border-wotori-accent/40 hover:bg-white dark:border-white/20 dark:bg-black/50 dark:text-white dark:shadow-[0_12px_30px_rgba(0,0,0,0.35)] dark:hover:border-wotori-accent/40 dark:hover:bg-black/70" />
        </header>

        <Intro />
        <Resources />
        <Channels />

        <Footer position="relative" brand="Wotori Studio" />
      </div>
    </main>
  );
}
