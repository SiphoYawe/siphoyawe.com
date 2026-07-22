"use client";

import { Section } from "@/components/ui/section";
import { Polaroid } from "@/components/ui/polaroid";
import { TagChip } from "@/components/ui/tag-chip";
import { BentoCard } from "@/components/ui/bento-card";
import { Handwritten } from "@/components/ui/handwritten";
import { Reveal } from "@/components/ui/reveal";
import { DoodleArrow } from "@/components/ui/doodles";
import { motion, useReducedMotion } from "framer-motion";
import { staggerPop } from "@/lib/motion";
import { BIO, IDENTITY_CHIPS, POLAROID_CAPTION } from "@/data/about";

/** The main headshot (content-drop/images: Sipho speaking, black hoodie). */
const HEADSHOT = { src: "/images/sipho-main-1200.webp", alt: "Sipho Yawe speaking into a microphone" };

/**
 * About (brief section 6.2): tilted polaroid with status pill and scattered
 * identity chips, and a warm bio in bento cards.
 */
export function About() {
  const reduce = useReducedMotion();
  return (
    <Section id="about" title="A bit about me" aside="the two-minute version">
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        {/* Polaroid + scattered chips */}
        <Reveal variant="left" className="relative mx-auto w-fit lg:mx-0">
          <Polaroid
            src={HEADSHOT.src}
            alt={HEADSHOT.alt}
            caption={POLAROID_CAPTION}
            status="Open to talks"
            rotate={-4}
            tape
            className="w-64 sm:w-72"
          />
          {/* chips pop in around the polaroid once it lands */}
          {[
            "absolute -top-6 -right-10 hidden rotate-6 sm:block",
            "absolute top-1/3 -right-14 hidden sm:block",
            "absolute -bottom-4 -right-8 hidden sm:block",
            "absolute -top-4 -left-10 hidden -rotate-6 sm:block",
            "absolute top-1/2 -left-14 hidden sm:block",
          ].map((pos, i) => (
            <motion.div
              key={pos}
              aria-hidden
              variants={staggerPop}
              initial={reduce ? false : "hidden"}
              whileInView={reduce ? undefined : "visible"}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.35 + i * 0.09 }}
              className={pos}
            >
              <TagChip label={IDENTITY_CHIPS[i].label} color={IDENTITY_CHIPS[i].color} rotate={IDENTITY_CHIPS[i].rotate} />
            </motion.div>
          ))}
          {/* chips inline on small screens */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 sm:hidden">
            {IDENTITY_CHIPS.map((chip) => (
              <TagChip key={chip.label} {...chip} />
            ))}
          </div>
        </Reveal>

        {/* Bio bento cards */}
        <div className="grid gap-5">
          <Reveal>
            <BentoCard className="relative">
              <p className="text-lg leading-relaxed">{BIO.short}</p>
              <DoodleArrow className="absolute bottom-2 right-11 w-12 rotate-[160deg] text-or" />
            </BentoCard>
          </Reveal>
          <Reveal delay={0.08}>
            <BentoCard>
              <p className="leading-relaxed text-ink-soft">{BIO.whatIDo}</p>
            </BentoCard>
          </Reveal>
          <Reveal delay={0.16}>
            <BentoCard>
              <p className="leading-relaxed text-ink-soft">{BIO.offKeyboard}</p>
              <Handwritten className="mt-4" rotate={-1.5}>
                you won&apos;t find this part in an interview
              </Handwritten>
            </BentoCard>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
