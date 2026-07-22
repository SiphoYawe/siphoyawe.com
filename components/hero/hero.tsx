"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { RayShader } from "./ray-shader";
import { Wordmark } from "./wordmark";
import { springs } from "@/lib/motion";

/**
 * Hero: shader ray fan, a warm greeting above the giant wordmark, and Coram
 * Deo hand-lettered small nearby (brief section 6.1). The wordmark letters
 * hide the sticker easter eggs. The greeting block settles in as a staggered
 * cascade once the preloader curtain lifts.
 */
export function Hero() {
  const t = useTranslations("hero");
  const reduce = useReducedMotion();

  const cascade = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.14, delayChildren: 0.25 } },
  };
  const line = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: springs.soft },
  };

  return (
    <section className="relative flex min-h-svh flex-col justify-end overflow-hidden pb-4 sm:pb-8">
      <RayShader />

      <motion.div
        variants={cascade}
        initial={reduce ? false : "hidden"}
        animate="visible"
        className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-8 sm:px-8 sm:pb-14"
      >
        <motion.p variants={line} className="max-w-md text-lg text-ink-soft sm:text-xl">
          <span className="font-semibold text-ink">{t("greeting")}</span>
          <br />
          {t("tagline")}
        </motion.p>
        <motion.p variants={line} className="mt-3 -rotate-2 font-hand text-xl text-ink-soft sm:text-2xl">
          {t("blessing")}
        </motion.p>
        {/* Coram Deo spine: hand-lettered near the hero blessing */}
        <motion.p
          variants={line}
          className="mt-1 ml-8 -rotate-3 font-hand text-xl text-[#a8870c] sm:text-2xl dark:text-or"
        >
          coram deo
        </motion.p>
      </motion.div>

      <Wordmark />
    </section>
  );
}
