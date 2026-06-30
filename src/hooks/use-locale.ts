import { useState, useCallback } from "react";
import { getLocale, setLocale, type Locale } from "@/i18n";

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(getLocale);

  const changeLocale = useCallback((l: Locale) => {
    setLocale(l);
    setLocaleState(l);
  }, []);

  return { locale, changeLocale };
}
