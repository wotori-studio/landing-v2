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
    ? "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
    : "border-white/40 text-white hover:bg-white/10 hover:border-white";

  return (
    <a
      className={`${baseClasses} ${variantClasses}`}
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      <span>{label}</span>
      <span className="text-xs uppercase tracking-[0.2em] text-gray-300">
        {openLabel}
      </span>
    </a>
  );
}

export default function Channels() {
  const { t } = useI18n();
  const openLabel = t("common.open");

  return (
    <section className="min-h-screen flex items-center justify-center bg-black text-white px-6 sm:px-10 lg:px-16">
      <div className="w-full max-w-4xl">
        <header className="mb-10 sm:mb-14 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
            {t("wotori.channels.label")}
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-light">
            {t("wotori.channels.heading")}
          </h2>
        </header>

        <div className="relative group bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md transition-all duration-200 hover:bg-white/10 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                {t("wotori.channels.studioTag")}
              </p>
              <h3 className="mt-2 text-2xl font-light">Wotori Studio</h3>
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
