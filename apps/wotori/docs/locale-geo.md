# Wotori landing: language & geo

## Behavior

1. **Saved choice wins** — If `localStorage` has `wotori-language` (`en` | `ru` | `zh`), that value is used. Changing language in the switcher updates this key (via `I18nProvider`).
2. **First visit (no key)** — Language is inferred from **`x-vercel-ip-country`** (Vercel / compatible edge):
   - **Chinese:** `CN`, `HK`, `MO`, `TW` → `zh`
   - **Russian:** `RU` → `ru`
   - **Otherwise** → `en`
3. After auto-pick, the chosen code is **written to `localStorage`** so the next visit does not depend on geo alone.

## Implementation

- `lib/geo-language.ts` — `countryToPreferredLanguage`
- `lib/i18n-constants.ts` — storage key `wotori-language`
- `app/layout.tsx` — reads country via `headers()`, injects `next/script` `beforeInteractive` to sync `document.documentElement.lang`, `window.__WOTORI_INITIAL_LANG__`, and `localStorage` before React hydrates
- `lib/i18n-provider.tsx` — reads `__WOTORI_INITIAL_LANG__` on the client; keeps `localStorage` in sync when the user changes language

## Local dev

Without Vercel headers, country is missing → default **`en`**. You can still set language via the switcher; it persists in `localStorage`.

## Hydration

If the saved language differs from the server geo guess (e.g. travel / VPN), `<html>` and an inner wrapper use `suppressHydrationWarning` to avoid noisy mismatches.
