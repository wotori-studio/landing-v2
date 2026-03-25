"use client";

import { useI18n } from "../lib/i18n-provider";

function ChannelLink({
  label,
  href,
  subtle = false,
  openLabel,
}: {
  label: string;
  href: string;
  subtle?: boolean;
  openLabel: string;
}) {
  const baseClasses =
    "flex items-center justify-between rounded-full px-4 py-2.5 text-sm sm:text-base border transition-all duration-200";

  const variantClasses = subtle
    ? "border-slate-200 text-slate-500 hover:border-wotori-accent/40 hover:text-slate-900 dark:border-white/20 dark:text-slate-300 dark:hover:border-wotori-accent/40 dark:hover:text-white"
    : "border-slate-300 text-slate-700 hover:border-wotori-accent/50 hover:bg-slate-50 hover:shadow-[0_0_20px_rgba(0,228,175,0.12)] dark:border-white/40 dark:text-white dark:hover:border-wotori-accent/50 dark:hover:bg-white/5";

  return (
    <a
      className={`${baseClasses} ${variantClasses}`}
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      <span>{label}</span>
      <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
        {openLabel}
      </span>
    </a>
  );
}

export default function Channels() {
  const { t } = useI18n();
  const openLabel = t("common.open");

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center px-6 py-24 sm:px-10 lg:px-16">
      <div className="relative w-full max-w-4xl">
        <header className="mb-10 text-center sm:mb-14">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-wotori-accent/90">
            {t("wotori.channels.label")}
          </p>
          <h2 className="mt-4 font-headline text-3xl font-light tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
            {t("wotori.channels.heading")}
          </h2>
        </header>

        <div className="group relative rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.05)] backdrop-blur-xl transition-all duration-300 hover:border-wotori-accent/40 hover:bg-white hover:shadow-[0_28px_90px_rgba(0,228,175,0.15)] dark:border-white/10 dark:bg-white/[0.06] dark:shadow-[0_24px_80px_rgba(0,0,0,0.5)] dark:hover:border-white/20 dark:hover:bg-white/[0.08] dark:hover:shadow-[0_28px_90px_rgba(0,228,175,0.08)] sm:p-8">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-wotori-accent/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                {t("wotori.channels.studioTag")}
              </p>
              <h3 className="mt-2 font-headline text-2xl font-light text-slate-900 dark:text-white">
                Wotori Studio
              </h3>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ChannelLink
              label={t("wotori.channels.links.twitter")}
              href="https://twitter.com/wotorimovako"
              openLabel={openLabel}
            />
            <ChannelLink
              label={t("wotori.channels.links.instagram")}
              href="https://www.instagram.com/wotoristudio/"
              openLabel={openLabel}
            />
            <ChannelLink
              label={t("wotori.channels.links.discord")}
              href="https://discord.gg/De83tH6H"
              openLabel={openLabel}
            />
            <ChannelLink
              label={t("wotori.channels.links.telegram")}
              href="https://t.me/wotoristudio"
              openLabel={openLabel}
            />
            <ChannelLink
              label={t("wotori.channels.links.email")}
              href="mailto:wotorimovako@gmail.com"
              subtle
              openLabel={openLabel}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
