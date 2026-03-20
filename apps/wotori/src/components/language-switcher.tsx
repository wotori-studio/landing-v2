"use client";

import React, { useEffect, useRef, useState } from "react";
import { useI18n } from "../lib/i18n-provider";

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({
  className = "",
}: LanguageSwitcherProps) {
  const { language, setLanguage, supportedLanguages, languageLabels, t } =
    useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const activeLanguageLabel = languageLabels[language] ?? language;
  const hasCustomStyle = className.trim().length > 0;

  useEffect(() => {
    function handleOutsideClick(event: Event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative inline-block"
      aria-label={t("common.languageSwitcherLabel")}
    >
      <button
        type="button"
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition ${
          hasCustomStyle
            ? className
            : "border-white/40 bg-black/35 text-white hover:bg-black/50"
        }`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t("common.languageSwitcherLabel")}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="opacity-80">{t("common.languageSwitcherLabel")}</span>
        <span className="font-bold">{activeLanguageLabel}</span>
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 min-w-[120px] overflow-hidden rounded-2xl border border-gray-200 bg-white text-sm shadow-xl"
          role="menu"
        >
          {supportedLanguages.map((code) => {
            const isActive = code === language;

            return (
              <button
                key={code}
                type="button"
                className={`flex w-full items-center justify-between px-4 py-2 text-left transition ${
                  isActive
                    ? "bg-gray-100 font-semibold text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                role="menuitem"
                onClick={() => {
                  setLanguage(code);
                  setIsOpen(false);
                }}
              >
                <span>{languageLabels[code] ?? code}</span>
                {isActive && <span>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
