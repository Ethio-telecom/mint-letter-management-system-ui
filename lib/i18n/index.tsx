"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { am, type TranslationKey } from "./am";

export type Locale = "en" | "am";
export type { TranslationKey };

export const locales: { value: Locale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "am", label: "አማርኛ" },
];

const STORAGE_KEY = "locale";
const EVENT = "locale-change";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readLocale(): Locale {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "am" ? "am" : "en";
  } catch {
    return "en";
  }
}

type Vars = Record<string, string | number>;

type I18n = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Translate a UI string. The English text is the key. */
  t: (key: TranslationKey, vars?: Vars) => string;
  /** Translate a data value (status, role, …); unknown values pass through unchanged. */
  tv: (value: string) => string;
};

const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, readLocale, () => "en" as Locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const value = useMemo<I18n>(() => {
    const tv = (text: string) => (locale === "am" ? ((am as Record<string, string>)[text] ?? text) : text);
    const t = (key: TranslationKey, vars?: Vars) => {
      const text = tv(key);
      return vars ? text.replace(/\{(\w+)\}/g, (match, name) => String(vars[name] ?? match)) : text;
    };
    return { locale, setLocale, t, tv };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside <I18nProvider>");
  return context;
}
