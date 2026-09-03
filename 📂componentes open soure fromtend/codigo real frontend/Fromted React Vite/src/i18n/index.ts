import en from "./locales/en-US.json";
import es from "./locales/es-US.json";
import fr from "./locales/fr.json";
import pt from "./locales/pt.json";

export type Locale = "en-US" | "es-US" | "fr" | "pt";

const catalogs: Record<Locale, Record<string, string>> = {
  "en-US": en,
  "es-US": es,
  fr,
  pt,
};

let current: Locale = "es-US";

export function setLocale(locale: Locale) {
  current = locale;
  document.documentElement.lang = locale.startsWith("en") ? "en" : locale.slice(0, 2);
}

export function getLocale(): Locale {
  return current;
}

export function t(key: string): string {
  return catalogs[current][key] ?? catalogs["en-US"][key] ?? key;
}

export const LOCALES: Locale[] = ["en-US", "es-US", "fr", "pt"];
