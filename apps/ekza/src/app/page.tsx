"use client";

import { useEffect } from "react";
import { HeroSection } from "../components/hero-section";
import ProjectCards from "../components/project-cards";
import Footer from "../components/footer";
import { SayHi } from "../components/say-hi";
import Header from "../components/header";
import { NewsletterForm } from "../components/newsletter-form";
import { useI18n } from "../lib/i18n-provider";

export default function EkzaLandingPage() {
  const { language, t } = useI18n();

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
        "https://ekza.io/ipfs/Qmc7sh3DefV3YA7xgXAnC1GE8ncsoyChtY6fBEiFDWE2bB",
      imgPath2:
        "https://ekza.io/ipfs/QmSPYQV89xvj1aaQcPtoAsyVJNUF8sb27uvoHxNdBZPsaV",
      text: stellarText,
      link: "https://stellar.ekza.io",
      isFlip: true,
    },
    {
      projectName: "Avatar",
      imgPath:
        "https://ekza.io/ipfs/QmNStm5ABJp8gBPsJER4yzG5EUwforVxXQNjbkVuKPu9Nr",
      imgPath2:
        "https://ekza.io/ipfs/QmanL1Qp6t4nAW4gyfHG1zKj4u8Scyh7Q7ypBPMewLHEB1",
      text: avatarText,
      link: "https://avatar.ekza.io",
      isFlip: true,
    },
    {
      projectName: "Space",
      imgPath:
        "https://ekza.io/ipfs/QmaBTrVEcyjdj4ky8pRQ2h3dQrGD8bNup5WXx3QjLmZ3PR",
      imgPath2: "",
      text: spaceText,
      link: "https://space.ekza.io",
      isFlip: true,
    },
  ];

  const heroButtons = [
    {
      text: t("ekza.hero.buttons.joinWaitlist"),
      link: "mailto:wotorimovako@gmail.com?subject=Ekza%20Waitlist",
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
    <main className="font-sans text-gray-900">
      <SayHi />
      <Header />

      <HeroSection
        imageUrl="/img/ekza_wotori_space.jpeg"
        imageAlt="Stylized image of the moon"
        title={t("ekza.hero.title")}
        subtitle={t("ekza.hero.subtitle")}
        description={myHeroDescription}
        buttons={heroButtons}
        heroHeight="h-screen"
        footerCenter={t("ekza.hero.footerCenter")}
      />

      <section id="how-it-works" className="bg-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-6 text-gray-900">
            {t("ekza.howItWorks.heading")}
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-12">
            {t("ekza.howItWorks.description")}
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 text-left">
            {platformLayers.map((layer) => (
              <article
                key={layer.title}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm"
              >
                <h3 className="text-2xl font-semibold mb-3">{layer.title}</h3>
                <p className="text-gray-700 leading-relaxed">{layer.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="ecosystem-modules" className="bg-gray-50 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-6 text-gray-800">
            {t("ekza.ecosystem.heading")}
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-4">
            {t("ekza.ecosystem.description")}
          </p>
          <p className="max-w-3xl mx-auto mb-8">
            <span className="inline-flex rounded-full border border-amber-300 bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-900">
              {t("ekza.ecosystem.statusNote")}
            </span>
          </p>
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
            <ProjectCards projects={projects} />
          </div>
        </div>
      </section>

      <section id="philosophy" className="bg-black text-white py-24">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-4">
            {t("ekza.philosophy.label")}
          </p>
          <h2 className="text-5xl font-bold mb-8">
            {t("ekza.philosophy.heading")}
          </h2>
          <blockquote className="max-w-4xl mx-auto text-2xl md:text-3xl leading-relaxed font-light">
            {t("ekza.philosophy.quote")}
          </blockquote>
        </div>
      </section>

      {/* Newsletter subscription section */}
      <section id="newsletter" className="bg-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Subscribe to Newsletter
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">
            Stay updated with the latest news and updates from Ekza Space
          </p>
          <NewsletterForm />
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
    </main>
  );
}
