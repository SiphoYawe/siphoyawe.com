"use client";

import { LOCALE_LABELS, LOCALES, type Locale } from "@/lib/i18n";
import { useLocale } from "@/components/providers/locale-provider";

/**
 * Decorative EN / LG / RN toggle (brief section 5). Cycles through the three
 * locales; the translated surface stays intentionally small.
 */
export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  const cycle = () => {
    const next =
      LOCALES[(LOCALES.indexOf(locale) + 1) % LOCALES.length] as Locale;
    setLocale(next);
  };

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Language: ${LOCALE_LABELS[locale]}. Switch language`}
      className="cursor-pointer rounded-full px-2.5 py-1.5 font-display text-xs font-semibold tracking-wider text-ink-soft transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
    >
      {LOCALE_LABELS[locale]}
    </button>
  );
}
