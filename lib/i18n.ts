import en from "@/messages/en.json";
import lg from "@/messages/lg.json";
import rn from "@/messages/rn.json";

export const LOCALES = ["en", "lg", "rn"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  lg: "LG",
  rn: "RN",
};

export const MESSAGES: Record<Locale, typeof en> = { en, lg, rn };
