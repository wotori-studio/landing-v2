"use client";

import React from "react";
import LanguageSwitcher from "./language-switcher";
import { useI18n } from "../lib/i18n-provider";

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  const { t } = useI18n();

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm ${className}`}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#hero" className="text-2xl sm:text-3xl font-extrabold text-black">
            {t("header.brand")}
          </a>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <nav className="hidden md:flex space-x-6 text-gray-600">
              <a
                href="#hero"
                className="hover:text-purple-600 transition"
              >
                {t("header.nav.hero")}
              </a>
              <a
                href="#how-it-works"
                className="hover:text-purple-600 transition"
              >
                {t("header.nav.howItWorks")}
              </a>
              <a
                href="#ecosystem-modules"
                className="hover:text-purple-600 transition"
              >
                {t("header.nav.ecosystem")}
              </a>
              <a
                href="#philosophy"
                className="hover:text-purple-600 transition"
              >
                {t("header.nav.philosophy")}
              </a>
            </nav>
            <LanguageSwitcher className="border-gray-300 bg-white/80 text-gray-800 hover:bg-gray-100" />
            <a
              href="https://github.com/ekza-space"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-purple-600 transition"
            >
              <GitHubIcon className="w-6 h-6" />
            </a>
          </div>
        </div>
      </header>
      <div className="h-20"></div>
    </>
  );
};

export default Header;
