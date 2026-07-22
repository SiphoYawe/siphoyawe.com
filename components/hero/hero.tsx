"use client";

import { useTranslations } from "next-intl";
import { RayBurst } from "./ray-burst";
import { Wordmark } from "./wordmark";

/**
 * Hero: ray-burst fan, a warm greeting above the giant wordmark, and Coram
 * Deo hand-lettered small nearby (brief section 6.1). The wordmark letters
 * hide the sticker easter eggs.
 */
export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative flex min-h-svh flex-col justify-end overflow-hidden pb-4 sm:pb-8">
      <RayBurst />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-8 sm:px-8 sm:pb-14">
        <p className="max-w-md text-lg text-ink-soft sm:text-xl">
          <span className="font-semibold text-ink">{t("greeting")}</span>
          <br />
          {t("tagline")}
        </p>
        <p className="mt-3 -rotate-2 font-hand text-xl text-ink-soft sm:text-2xl">
          {t("blessing")}
        </p>
        {/* Coram Deo spine: hand-lettered near the hero blessing */}
        <p className="mt-1 ml-8 -rotate-3 font-hand text-xl text-[#a8870c] sm:text-2xl dark:text-or">
          coram deo
        </p>
      </div>

      <Wordmark />
    </section>
  );
}
