"use client";

import { useState, useEffect } from "react";
import { HeroSection } from "../components/hero-section";
import ProjectCards from "../components/project-cards";
import Footer from "../components/footer";
import { SayHi } from "../components/say-hi";
import Header from "../components/header";
import { NewsletterForm } from "../components/newsletter-form";
import { WaitlistModal } from "../components/waitlist-modal";
import { PartnerSpotlight } from "../components/partner-spotlight";
import { useI18n } from "../lib/i18n-provider";

export default function EkzaLandingPage() {
  const { language, t } = useI18n();
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  useEffect(() => {
    document.title = t("meta.ekzaTitle");
  }, [language, t]);

  const stellarText = t("ekza.ecosystem.projects.stellar");

  const spaceText = t("ekza.ecosystem.projects.space");

  const avatarText = t("ekza.ecosystem.projects.avatar");

  const myHeroDescription = t("ekza.hero.description");

  const platformLayers = [
    {
      title: t("ekza.howItWorks.layers.coCreate.title"),
      description: t("ekza.howItWorks.layers.coCreate.description"),
    },
    {
      title: t("ekza.howItWorks.layers.marketplace.title"),
      description: t("ekza.howItWorks.layers.marketplace.description"),
    },
    {
      title: t("ekza.howItWorks.layers.integrate.title"),
      description: t("ekza.howItWorks.layers.integrate.description"),
    },
    {
      title: t("ekza.howItWorks.layers.monetize.title"),
      description: t("ekza.howItWorks.layers.monetize.description"),
    },
  ];

  const projects = [
    {
      projectName: "Stellar",
      imgPath:
        "https://ipfs.io/ipfs/Qmc7sh3DefV3YA7xgXAnC1GE8ncsoyChtY6fBEiFDWE2bB",
      imgPath2:
        "https://ipfs.io/ipfs/QmSPYQV89xvj1aaQcPtoAsyVJNUF8sb27uvoHxNdBZPsaV",
      text: stellarText,
      link: "https://stellar.ekza.io",
      isFlip: true,
    },
    {
      projectName: "Avatar",
      imgPath:
        "https://ipfs.io/ipfs/QmNStm5ABJp8gBPsJER4yzG5EUwforVxXQNjbkVuKPu9Nr",
      imgPath2:
        "https://ipfs.io/ipfs/QmanL1Qp6t4nAW4gyfHG1zKj4u8Scyh7Q7ypBPMewLHEB1",
      text: avatarText,
      link: "https://avatar.ekza.io",
      isFlip: true,
    },
    {
      projectName: "Space",
      imgPath:
        "https://ipfs.io/ipfs/QmaBTrVEcyjdj4ky8pRQ2h3dQrGD8bNup5WXx3QjLmZ3PR",
      imgPath2: "",
      text: spaceText,
      link: "https://space.ekza.io",
      isFlip: true,
    },
  ];

  const heroButtons = [
    {
      text: t("ekza.hero.buttons.joinWaitlist"),
      onClick: () => setIsWaitlistOpen(true),
      variant: "primary" as const,
    },
    {
      text: t("ekza.hero.buttons.openApp"),
      link: "https://space.ekza.io",
      variant: "secondary" as const,
    },
    {
      text: t("ekza.hero.buttons.readDocs"),
      link: "https://github.com/ekza-space",
      variant: "secondary" as const,
    },
  ];

  const footerLinks = [
    {
      label: t("ekza.footer.documentation"),
      href: "https://github.com/ekza-space",
    },
    { label: t("ekza.footer.twitter"), href: "https://twitter.com/EkzaSpace" },
    { label: t("ekza.footer.discord"), href: "https://discord.gg/yUWb4Q5b" },
    { label: t("ekza.footer.telegram"), href: "https://t.me/ekzaspace" },
  ];

  return (
    <main className="font-ekza text-ekza-on">
      <SayHi />
      <Header />

      <HeroSection
        imageUrl="/img/ekza_wotori_space.jpeg"
        imageAlt="Stylized image of the moon"
        title={t("ekza.hero.title")}
        subtitle={t("ekza.hero.subtitle")}
        quoteEyebrow={t("ekza.hero.quoteEyebrow")}
        quote={t("ekza.hero.quote")}
        description={myHeroDescription}
        buttons={heroButtons}
        heroHeight="min-h-screen"
        footerCenter={t("ekza.hero.footerCenter")}
      />

      <section id="how-it-works" className="border-t border-ekza-border/20 bg-ekza-surface py-20 dark:border-white/10 dark:bg-[#0c0e12]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-headline text-4xl font-bold tracking-tight text-ekza-on dark:text-white md:text-5xl">
            {t("ekza.howItWorks.heading")}
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg font-light text-ekza-on-muted dark:text-white/70">
            {t("ekza.howItWorks.description")}
          </p>
          <div className="mt-14 grid gap-5 text-left md:grid-cols-2 lg:grid-cols-4">
            {platformLayers.map((layer) => (
              <article
                key={layer.title}
                className="group rounded-2xl bg-ekza-elevated/90 p-7 shadow-ekza-card transition hover:-translate-y-0.5 dark:bg-white/[0.06] dark:shadow-ekza-card-dark"
              >
                <h3 className="font-headline text-xl font-semibold text-ekza-on dark:text-white">
                  {layer.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ekza-on-muted dark:text-white/75">
                  {layer.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="ecosystem-modules"
        className="border-t border-ekza-border/15 bg-ekza-muted py-20 dark:border-white/5 dark:bg-[#111417]"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-headline text-4xl font-bold tracking-tight text-ekza-on dark:text-white md:text-5xl">
            {t("ekza.ecosystem.heading")}
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg font-light text-ekza-on-muted dark:text-white/70">
            {t("ekza.ecosystem.description")}
          </p>
          <p className="mx-auto mt-6 mb-10 max-w-3xl">
            <span className="inline-flex rounded-full border border-amber-400/50 bg-amber-100/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-amber-950 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-100">
              {t("ekza.ecosystem.statusNote")}
            </span>
          </p>
          <div className="flex flex-col items-stretch justify-center gap-8 md:flex-row">
            <ProjectCards projects={projects} />
          </div>
        </div>
      </section>

      <PartnerSpotlight />

      <section
        id="philosophy"
        className="relative overflow-hidden border-t border-ekza-border/20 bg-gradient-to-b from-indigo-50/80 via-ekza-bg to-ekza-bg py-24 dark:border-white/10 dark:from-transparent dark:via-[#0c0e12] dark:to-[#111417]"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-100"
          aria-hidden
        >
          <div className="absolute inset-0 bg-gradient-to-b from-ekza-primary/5 via-transparent to-transparent dark:from-cyan-500/10" />
        </div>
        <div className="container relative z-10 mx-auto px-6 text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-ekza-primary dark:text-cyan-300/90">
            {t("ekza.philosophy.label")}
          </p>
          <h2 className="font-headline text-4xl font-bold text-ekza-on dark:text-white md:text-5xl">
            {t("ekza.philosophy.heading")}
          </h2>
          <blockquote className="mx-auto mt-10 max-w-4xl text-xl font-light leading-relaxed text-ekza-on-muted dark:text-white/85 md:text-2xl">
            {t("ekza.philosophy.quote")}
          </blockquote>
        </div>
      </section>

      <section
        id="newsletter"
        className="border-t border-ekza-border/20 bg-ekza-surface py-20 dark:border-white/10 dark:bg-[#0c0e12]"
      >
        <div className="container mx-auto px-6 text-center">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-ekza-primary/20 bg-ekza-primary-muted/40 p-10 dark:border-cyan-500/20 dark:bg-cyan-950/20 md:p-14">
            <h2 className="font-headline text-3xl font-bold text-ekza-on dark:text-white md:text-4xl">
              {t("ekza.newsletter.heading")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ekza-on-muted dark:text-white/70">
              {t("ekza.newsletter.description")}
            </p>
            <div className="mt-8">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

      <Footer
        position="relative"
        brand="Ekza Space"
        links={footerLinks}
        studioCreditText={t("ekza.footer.creditText")}
        studioCreditLabel={t("ekza.footer.creditLabel")}
        studioCreditHref="https://wotori.io"
      />

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </main>
  );
}
