import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { getLocale, setLocale, t, type Locale, type I18nKeys } from "@/i18n";

type LocaleCtx = {
  locale: Locale;
  strings: I18nKeys;
  changeLocale: (l: Locale) => void;
};

const LocaleContext = createContext<LocaleCtx | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getLocale);

  const changeLocale = useCallback((l: Locale) => {
    setLocale(l);
    setLocaleState(l);
  }, []);

  const value = useMemo<LocaleCtx>(
    () => ({ locale, strings: t(locale), changeLocale }),
    [locale, changeLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

/** Hook to consume locale strings and the locale switcher from anywhere in the tree */
export function useI18n(): LocaleCtx {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useI18n must be used inside LocaleProvider");
  return ctx;
}
