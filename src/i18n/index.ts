import { en } from "./en";
import { sw } from "./sw";

export type Locale = "en" | "sw";
export type { I18nKeys } from "./en";

export const locales: Record<Locale, typeof en> = { en, sw };

const STORAGE_KEY = "maizevision.locale";

export function getLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale;
    if (stored && stored in locales) return stored;
  } catch { /* quota */ }
  const nav = navigator.language.toLowerCase();
  return nav.startsWith("sw") ? "sw" : "en";
}

export function setLocale(locale: Locale): void {
  try { localStorage.setItem(STORAGE_KEY, locale); } catch { /* quota */ }
}

/** Retrieve the translation map for a given locale */
export function t(locale: Locale): typeof en {
  return locales[locale] ?? en;
}
