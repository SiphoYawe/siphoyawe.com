"use client";

import { useTranslations } from "next-intl";

/**
 * Translated section kicker (EN / LG / RN decorative surface). Use inside
 * server-rendered sections: <Section kicker={<Kicker k="awards" />}>.
 */
export function Kicker({ k }: { k: string }) {
  const t = useTranslations("kickers");
  return <>{t(k)}</>;
}
