import translations from "./translations.json";

export type JsonMap = Record<string, unknown>;

export interface I18nConfig {
  defaultLanguage: string;
  supportedLanguages: string[];
  languageLabels: Record<string, string>;
  translations: Record<string, JsonMap>;
}

export const i18nConfig = translations as I18nConfig;

export const defaultLanguage = i18nConfig.defaultLanguage;
export const supportedLanguages = i18nConfig.supportedLanguages;
export const languageLabels = i18nConfig.languageLabels;

function resolveKey(source: unknown, key: string): string | undefined {
  if (!source || typeof source !== "object") {
    return undefined;
  }

  const value = key
    .split(".")
    .reduce<unknown>((acc, part) => {
      if (acc && typeof acc === "object" && part in (acc as JsonMap)) {
        return (acc as JsonMap)[part];
      }
      return undefined;
    }, source);

  return typeof value === "string" ? value : undefined;
}

export function getTranslation(language: string, key: string): string {
  const languageTable = i18nConfig.translations[language];
  const fallbackTable = i18nConfig.translations[defaultLanguage];

  const currentValue = resolveKey(languageTable, key);
  if (currentValue) {
    return currentValue;
  }

  const fallbackValue = resolveKey(fallbackTable, key);
  if (fallbackValue) {
    return fallbackValue;
  }

  return key;
}

export function isSupportedLanguage(language: string): boolean {
  return supportedLanguages.includes(language);
}
