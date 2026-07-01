"use client";

import { useEffect, useState } from "react";
import StudioHero from "./studio-hero";
import StudioWork from "./studio-work";
import ProjectInquiryForm from "./project-inquiry-form";
import Reveal, { Marquee } from "./studio-reveal";
import { ThemeToggle } from "./theme-toggle";
import LanguageSwitcher from "./language-switcher";
import { useI18n } from "../lib/i18n-provider";

const SERVICE_TAGS = [
  ["tokens", "dApps", "wallets"],
  ["landing pages", "webGL", "brand systems"],
  ["avatars", "real-time 3D", "worlds"],
  ["automation", "rapid prototyping", "lean teams"],
];

const CHANNELS = [
  { label: "X / Twitter", href: "https://twitter.com/wotorimovako" },
  { label: "Instagram", href: "https://www.instagram.com/wotoristudio/" },
  { label: "Discord", href: "https://discord.gg/De83tH6H" },
  { label: "Telegram", href: "https://t.me/wotoristudio" },
];

export default function WotoriHomePage() {
  const { language, t } = useI18n();
  const k = (key: string) => t(`wotori.studio.${key}`);
  const [animReady, setAnimReady] = useState(false);

  const services = [1, 2, 3, 4].map((n, i) => ({
    no: `0${n}`,
    title: k(`services.s${n}Title`),
    body: k(`services.s${n}Body`),
    tags: SERVICE_TAGS[i],
  }));

  const stats = [1, 2, 3].map((n) => ({
    metric: k(`manifesto.stat${n}Metric`),
    label: k(`manifesto.stat${n}Label`),
  }));

  useEffect(() => {
    document.title = t("meta.wotoriTitle");
  }, [language, t]);

  // Enable scroll-reveal animations only once JS is running, so text never
  // stays hidden during slow hydration (heavy 3D bundle).
  useEffect(() => {
    setAnimReady(true);
  }, []);

  return (
    <div className={`ws-root ${animReady ? "ws-anim-ready" : ""}`}>
      <div className="ws-floating-controls">
        <ThemeToggle className="ws-ctl" />
        <LanguageSwitcher className="ws-ctl" />
      </div>

      <StudioHero />

      <main>
        {/* Manifesto */}
        <section className="ws-section ws-manifesto" id="manifesto">
          <div className="ws-shell">
            <Reveal as="p" className="ws-index">{k("manifesto.index")}</Reveal>
            <Reveal as="h2" className="ws-statement" delay={80}>
              {k("manifesto.statement")}
            </Reveal>
            <div className="ws-manifesto__meta">
              <Reveal as="p" delay={160}>
                {k("manifesto.meta")}
              </Reveal>
              <Reveal className="ws-stats" delay={220}>
                {stats.map((s) => (
                  <div className="ws-stat" key={s.label}>
                    <span className="ws-stat__metric">{s.metric}</span>
                    <span className="ws-stat__label">{s.label}</span>
                  </div>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="ws-section ws-section--alt" id="services">
          <div className="ws-shell">
            <header className="ws-head">
              <Reveal as="p" className="ws-index">{k("services.index")}</Reveal>
              <Reveal as="h2" className="ws-h2" delay={80}>
                {k("services.heading")}
              </Reveal>
            </header>
            <div className="ws-services">
              {services.map((s, i) => (
                <Reveal as="article" className="ws-service" key={s.no} delay={i * 70}>
                  <span className="ws-service__no">{s.no}</span>
                  <div className="ws-service__main">
                    <h3 className="ws-service__title">{s.title}</h3>
                    <p className="ws-service__body">{s.body}</p>
                  </div>
                  <ul className="ws-service__tags">
                    {s.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Offer — the commercial door */}
        <section className="ws-section ws-offer" id="offer">
          <div className="ws-shell ws-offer__inner">
            <div className="ws-offer__lead">
              <Reveal as="p" className="ws-index">{k("offer.index")}</Reveal>
              <Reveal as="h2" className="ws-offer__title" delay={80}>
                {k("offer.heading")}
              </Reveal>
              <Reveal as="p" className="ws-offer__lede" delay={140}>
                {k("offer.lede")}
              </Reveal>
              <Reveal delay={260}>
                <a className="ws-btn ws-btn--primary" href="#contact">
                  {k("offer.cta")}
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </Reveal>
            </div>
            <Reveal as="ul" className="ws-offer__list" delay={180}>
              {[1, 2, 3, 4].map((n) => (
                <li className="ws-offer__item" key={n}>
                  <span className="ws-offer__bullet" aria-hidden="true" />
                  {k(`offer.b${n}`)}
                </li>
              ))}
              <li className="ws-offer__note">{k("offer.note")}</li>
            </Reveal>
          </div>
        </section>

        <Marquee
          items={["digital worlds", "websites", "3D characters", "web3", "games", "AI prototypes", "one team"]}
        />

        {/* Work */}
        <section className="ws-section" id="work">
          <div className="ws-shell">
            <header className="ws-head">
              <Reveal as="p" className="ws-index">{k("work.index")}</Reveal>
              <Reveal as="h2" className="ws-h2" delay={80}>
                {k("work.heading")}
              </Reveal>
            </header>
            <StudioWork />
          </div>
        </section>

        {/* Contact */}
        <section className="ws-section ws-cta" id="contact">
          <div className="ws-shell ws-cta__inner">
            <Reveal as="p" className="ws-index">{k("contact.index")}</Reveal>
            <Reveal as="h2" className="ws-cta__title" delay={80}>
              {k("contact.titleA")}
              <br />
              {k("contact.titleB")}
            </Reveal>
            <Reveal as="p" className="ws-cta__lede" delay={160}>
              {k("contact.lede")}
            </Reveal>
            <Reveal className="ws-cta__form" delay={220}>
              <ProjectInquiryForm />
            </Reveal>
            <Reveal as="p" className="ws-cta__fallback" delay={280}>
              {k("contact.orEmail")}{" "}
              <a className="ws-mail ws-mail--sm" href="mailto:wotorimovako@gmail.com">
                wotorimovako@gmail.com
              </a>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="ws-footer">
        <span className="ws-wordmark ws-wordmark--sm">
          wotori<span>.io</span>
        </span>
        <nav className="ws-footer__nav" aria-label="Social channels">
          {CHANNELS.map((c) => (
            <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer">
              {c.label}
            </a>
          ))}
        </nav>
        <span className="ws-footer__meta">
          © {new Date().getFullYear()} — {k("footer")}
        </span>
      </footer>
    </div>
  );
}
