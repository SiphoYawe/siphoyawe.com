"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Handwritten } from "@/components/ui/handwritten";
import { springs } from "@/lib/motion";
import { aiAsset } from "@/lib/ai-assets";
import { AWARDS, type Award } from "@/data/awards";

/** Hand-set tilt per certificate, papers pinned a touch off-square. */
const CERT_TILTS = [-2.6, 2.1];

/**
 * One framed certificate hung on the fridge door: the ornate generated frame,
 * the award text set into its blank centre, a strip of tape at the top.
 * Micro-interaction: lifts and squares up on hover, shadow stays on the door.
 */
function Certificate({ award, index }: { award: Award; index: number }) {
  const reduce = useReducedMotion();
  const certSrc = aiAsset("awards/certificate");
  const tilt = CERT_TILTS[index % CERT_TILTS.length];

  const settle: Variants = {
    hidden: { opacity: 0, y: 26, rotate: tilt * 2.4 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: tilt,
      transition: { ...springs.bouncy, delay: 0.15 + index * 0.12 },
    },
  };

  return (
    <motion.li
      variants={settle}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "visible"}
      viewport={{ once: true, margin: "-40px" }}
      className="relative w-[42%] max-w-44 shrink-0"
    >
      {/* drop shadow stays on the door while the certificate lifts */}
      <motion.span
        aria-hidden
        whileHover={reduce ? undefined : { opacity: 0.55, y: 7, scale: 0.94 }}
        transition={springs.bouncy}
        className="absolute inset-x-4 -bottom-2 h-5 rounded-[50%] bg-sable/30 blur-md"
      />
      <motion.div
        whileHover={reduce ? undefined : { y: -8, rotate: 0 }}
        transition={springs.bouncy}
        className="relative"
      >
        {certSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={certSrc} alt="" loading="lazy" className="w-full select-none" />
        ) : (
          /* cream card with a gold frame line, while the asset is absent */
          <div className="aspect-[916/1350] w-full rounded-sm border-[3px] border-or/70 bg-[#f6efdd] shadow-sm" />
        )}
        {/* the award, set into the certificate's blank centre */}
        <div className="absolute inset-x-[13%] top-[11%] text-center">
          <p className="font-display text-[clamp(0.6rem,2vw,0.82rem)] leading-tight font-bold text-[#3a2f14]">
            {award.name}
          </p>
          <p className="mt-[0.6em] text-[clamp(0.48rem,1.6vw,0.58rem)] font-medium tracking-[0.12em] text-[#6b5a2a] uppercase">
            {award.issuer} · {award.year}
          </p>
          {award.detail && (
            <p className="mt-[0.8em] -rotate-1 font-hand text-[clamp(0.55rem,1.9vw,0.72rem)] leading-tight text-[#7a6430]">
              {award.detail}
            </p>
          )}
        </div>
        {/* the tape it hangs by */}
        <motion.span
          aria-hidden
          initial={reduce ? false : { scale: 0, rotate: -8 }}
          whileInView={reduce ? undefined : { scale: 1, rotate: -4 }}
          viewport={{ once: true }}
          transition={{ ...springs.bouncy, delay: 0.5 + index * 0.12 }}
          className="absolute -top-2.5 left-1/2 h-5 w-14 -translate-x-1/2 rounded-[2px] bg-or/45 shadow-sm backdrop-blur-[1px]"
        />
      </motion.div>
    </motion.li>
  );
}

/**
 * Awards (brief section 6.5): the fridge as the kitchen wall, its body fading
 * out before the legs, with the two academic honours hung on the door as
 * framed certificates.
 */
export function Awards() {
  const fridgeSrc = aiAsset("artifacts/fridge");

  const certificates = AWARDS.map((award, i) => (
    <Certificate key={award.id} award={award} index={i} />
  ));

  return (
    <Section id="awards" title="The fridge" aside="hung where I see them">
      <Reveal>
        {/* the whole top of the fridge shows (shoulders + door); the body
            softly fades before the legs, never a hard crop */}
        <div className="relative mx-auto w-full max-w-md">
          {fridgeSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={fridgeSrc}
              alt=""
              loading="lazy"
              className="pointer-events-none w-full select-none"
              style={{
                maskImage: "linear-gradient(to bottom, #000 70%, transparent 86%)",
                WebkitMaskImage: "linear-gradient(to bottom, #000 70%, transparent 86%)",
              }}
            />
          ) : (
            /* CSS fridge door while the AI fridge is absent */
            <div className="relative aspect-[3/4] w-full rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,#f6f7f8,#e3e5e7_55%,#d0d3d6)] shadow-[0_20px_50px_rgb(0_0_0/0.18)] dark:border-white/10 dark:shadow-[0_20px_50px_rgb(0_0_0/0.55)]">
              <div
                aria-hidden
                className="absolute top-[30%] right-3 h-40 w-2.5 rounded-full bg-[linear-gradient(90deg,#b7bbc0,#e9ebed_50%,#a4a8ae)] shadow-[inset_0_1px_2px_rgb(255_255_255/0.7),0_3px_6px_rgb(0_0_0/0.3)]"
              />
            </div>
          )}
          {/* the framed certificates, hung on the door clear of the handle */}
          <ul className="absolute inset-0 flex content-start items-start justify-center gap-[4%] pt-[16%] pr-[16%] pl-[6%]">
            {certificates}
          </ul>
        </div>
      </Reveal>
      <Reveal delay={0.12}>
        <Handwritten className="mt-8 text-center" rotate={-1.5}>
          the paper versions live in a drawer somewhere
        </Handwritten>
      </Reveal>
    </Section>
  );
}
