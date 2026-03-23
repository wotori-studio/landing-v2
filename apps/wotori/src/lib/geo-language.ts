/**
 * Map Vercel geo country (ISO 3166-1 alpha-2, e.g. from x-vercel-ip-country) to UI language.
 * CN / HK / MO / TW → Chinese; RU → Russian; everything else → English.
 */
export function countryToPreferredLanguage(
  country: string | null | undefined
): "en" | "ru" | "zh" {
  if (!country || typeof country !== "string") {
    return "en";
  }
  const c = country.trim().toUpperCase();
  if (c === "CN" || c === "HK" || c === "MO" || c === "TW") {
    return "zh";
  }
  if (c === "RU") {
    return "ru";
  }
  return "en";
}
