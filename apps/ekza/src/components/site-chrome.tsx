"use client";

import React from "react";
import Header from "./header";
import Footer from "./footer";
import { SayHi } from "./say-hi";
import { AnimReady } from "./motion";
import { useI18n } from "../lib/i18n-provider";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();

  const navLinks = [
    { label: t("ekza.v2.nav.protocol"), href: "/protocol" },
    { label: t("ekza.v2.nav.developers"), href: "/developers" },
    { label: t("ekza.v2.nav.app"), href: "https://space.ekza.io", external: true },
  ];

  const socialLinks = [
    { label: t("ekza.footer.documentation"), href: "https://github.com/ekza-space" },
    { label: t("ekza.footer.twitter"), href: "https://twitter.com/EkzaSpace" },
    { label: t("ekza.footer.discord"), href: "https://discord.gg/yUWb4Q5b" },
    { label: t("ekza.footer.telegram"), href: "https://t.me/ekzaspace" },
  ];

  return (
    <>
      <AnimReady />
      <SayHi />
      <Header />
      {children}
      <Footer
        position="relative"
        brand="Ekza"
        navLinks={navLinks}
        links={socialLinks}
        studioCreditText={t("ekza.footer.creditText")}
        studioCreditLabel={t("ekza.footer.creditLabel")}
        studioCreditHref="https://wotori.io"
      />
    </>
  );
}

export default SiteChrome;
