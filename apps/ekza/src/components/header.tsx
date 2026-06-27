"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { useI18n } from "../lib/i18n-provider";
import { useReserve } from "../app/reserve-provider";

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  const { t } = useI18n();
  const { openReserve } = useReserve();
  const pathname = usePathname();

  const navItems = [
    { label: t("ekza.v2.nav.protocol"), href: "/protocol" },
    { label: t("ekza.v2.nav.developers"), href: "/developers" },
  ];

  const linkClass = (href: string) =>
    `transition hover:text-ekza-primary dark:hover:text-cyan-300 ${
      pathname === href ? "text-ekza-primary dark:text-cyan-300" : ""
    }`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b border-ekza-border/30 bg-ekza-bg/75 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/50 dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)] ${className}`}
      >
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link
            href="/"
            aria-label="ekza"
            className="font-audiowide text-2xl lowercase tracking-tight text-ekza-on dark:text-white sm:text-3xl"
          >
            ekza
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <nav className="hidden items-center gap-5 text-sm font-medium uppercase tracking-[0.06em] text-ekza-on-muted md:flex lg:gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={linkClass(item.href)}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="https://space.ekza.io"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-ekza-primary dark:hover:text-cyan-300"
              >
                {t("ekza.v2.nav.app")}
              </a>
            </nav>
            <button
              onClick={openReserve}
              className="hidden rounded-full bg-ekza-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ekza-on-primary shadow-sm transition hover:-translate-y-0.5 hover:shadow-ekza-glow dark:bg-gradient-to-r dark:from-[#00d1ff] dark:to-[#7701d0] dark:text-[#003543] sm:inline-flex"
            >
              {t("ekza.v2.nav.reserve")}
            </button>
            <ThemeToggle />
            <LanguageSwitcher className="border-ekza-border/60 bg-ekza-elevated/90 text-ekza-on hover:bg-ekza-muted dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15" />
            <a
              href="https://github.com/ekza-space"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ekza on GitHub"
              className="text-ekza-on-muted transition hover:text-ekza-primary dark:text-white/70 dark:hover:text-cyan-300"
            >
              <GitHubIcon className="h-6 w-6" />
            </a>
          </div>
        </div>
      </header>
      <div className="h-20"></div>
    </>
  );
};

export default Header;
