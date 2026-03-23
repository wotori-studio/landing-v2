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
import { WOTORI_LANGUAGE_STORAGE_KEY } from "./i18n-constants";

function readInitialLanguage(geoDefaultLanguage: string): string {
  const geo = isSupportedLanguage(geoDefaultLanguage)
    ? geoDefaultLanguage
    : defaultLanguage;

  if (typeof window !== "undefined") {
    const fromScript = (window as unknown as { __WOTORI_INITIAL_LANG__?: string })
      .__WOTORI_INITIAL_LANG__;
    if (fromScript && isSupportedLanguage(fromScript)) {
      return fromScript;
    }
  }

  return geo;
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

type I18nProviderProps = {
  children: React.ReactNode;
  /** From server geo (x-vercel-ip-country); script + localStorage may override on client. */
  geoDefaultLanguage: string;
};

export function I18nProvider({
  children,
  geoDefaultLanguage,
}: I18nProviderProps) {
  const [language, setLanguageState] = useState<string>(() =>
    readInitialLanguage(geoDefaultLanguage)
  );

  const setLanguage = useCallback((nextLanguage: string) => {
    if (!isSupportedLanguage(nextLanguage)) {
      return;
    }

    setLanguageState(nextLanguage);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(WOTORI_LANGUAGE_STORAGE_KEY, language);
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

  return (
    <I18nContext.Provider value={value}>
      {/* suppressHydrationWarning: saved locale in localStorage can differ from server geo guess */}
      <div className="contents" suppressHydrationWarning>
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}
