import { en } from "./en";
import { sw } from "./sw";

export type Locale = "en" | "sw";

export const locales: Record<Locale, typeof en> = { en, sw };

const STORAGE_KEY = "maizevision.locale";

/** Read the stored locale, falling back to browser language detection */
export function getLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale;
    if (stored && stored in locales) return stored;
  } catch { /* quota */ }
  const nav = navigator.language.toLowerCase();
  return nav.startsWith("sw") ? "sw" : "en";
}

/** Persist a locale choice to localStorage */
export function setLocale(locale: Locale) {
  try { localStorage.setItem(STORAGE_KEY, locale); } catch { /* quota */ }
}

export function t(locale: Locale): typeof en {
  return locales[locale] ?? en;
}
