"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  defaultLanguage,
  supportedLanguages,
  languageLabels,
  getTranslation,
  isSupportedLanguage,
} from "@repo/locales";

const STORAGE_KEY = "wotori-language";

function getInitialLanguage(): string {
  if (typeof window === "undefined") {
    return defaultLanguage;
  }

  const savedLanguage = localStorage.getItem(STORAGE_KEY);
  if (savedLanguage && isSupportedLanguage(savedLanguage)) {
    return savedLanguage;
  }

  return defaultLanguage;
}

interface I18nContextValue {
  language: string;
  defaultLanguage: string;
  supportedLanguages: string[];
  languageLabels: Record<string, string>;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<string>(getInitialLanguage);

  const setLanguage = useCallback((nextLanguage: string) => {
    if (!isSupportedLanguage(nextLanguage)) {
      return;
    }

    setLanguageState(nextLanguage);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, language);
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = useCallback(
    (key: string): string => getTranslation(language, key),
    [language]
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      defaultLanguage,
      supportedLanguages,
      languageLabels,
      setLanguage,
      t,
    }),
    [language, setLanguage, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}
