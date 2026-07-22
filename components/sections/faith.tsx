"use client";

import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Handwritten } from "@/components/ui/handwritten";
import { AiDoodle } from "@/components/ui/doodles";
import { PillButton } from "@/components/ui/pill-button";
import { motion, useReducedMotion } from "framer-motion";
import { springs } from "@/lib/motion";
import { FAITH } from "@/data/faith";
import { READY_SCRIBE_URL } from "@/data/socials";

/**
 * Faith (brief section 6.14): short, honest, quiet. A narrow centred column
 * with an illuminated drop cap, verse marginalia in the side margin, and one
 * pill out to Ready Scribe. Motion stays minimal: the drop cap settles, the
 * doodles drift in late.
 */
export function Faith() {
  const reduce = useReducedMotion();
  const firstLetter = FAITH.blurb.charAt(0);
  const rest = FAITH.blurb.slice(1);

  const marginalia = (
    <>
      {FAITH.marginalia.verse}
      <span className="mt-1.5 block text-lg">{FAITH.marginalia.reference}</span>
    </>
  );

  return (
    <Section id="faith" title="Coram Deo">
      <Reveal>
        <div className="relative mx-auto max-w-2xl">
          {/* crown over the column — Coram Deo, before God the King */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -10, rotate: 12 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ...springs.soft, delay: 0.55 }}
          >
            <AiDoodle
              name="crown"
              className="absolute -top-12 right-2 hidden w-16 rotate-6 opacity-75 sm:block"
            />
          </motion.div>
          {/* the ichthys, quiet in the lower margin */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10, rotate: -12 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ...springs.soft, delay: 0.75 }}
          >
            <AiDoodle
              name="fish"
              className="absolute -bottom-10 left-0 hidden w-16 -rotate-6 opacity-70 sm:block"
            />
          </motion.div>
          {/* Verse marginalia, tucked in the side margin on desktop */}
          <aside className="absolute top-1/2 -right-56 hidden w-48 -translate-y-1/2 lg:block xl:-right-64">
            <Handwritten rotate={3}>{marginalia}</Handwritten>
          </aside>

          <p className="text-lg leading-relaxed">
            <motion.span
              aria-hidden="true"
              initial={reduce ? false : { opacity: 0, scale: 1.25 }}
              whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={springs.bouncy}
              className="float-left m-0 mr-2.5 font-display text-[3.9rem] leading-[0.78] font-semibold text-or sm:text-7xl"
            >
              {firstLetter}
            </motion.span>
            <span className="sr-only">{firstLetter}</span>
            {rest}
          </p>

          {/* Same note, flowing below the text on smaller screens */}
          <aside className="mt-8 lg:hidden">
            <Handwritten rotate={-1.5}>{marginalia}</Handwritten>
          </aside>

          <p className="mt-8 leading-relaxed text-ink-soft">{FAITH.readyScribeNote}</p>

          <div className="mt-6">
            <PillButton label="Read Ready Scribe" href={READY_SCRIBE_URL} external badge="or" />
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
