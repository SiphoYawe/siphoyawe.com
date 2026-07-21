"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Kicker } from "@/components/ui/kicker";
import { Reveal } from "@/components/ui/reveal";
import { Handwritten } from "@/components/ui/handwritten";
import { springs } from "@/lib/motion";
import { aiAsset } from "@/lib/ai-assets";
import { AWARDS, type Award } from "@/data/awards";

const FACE_COLORS: Record<Award["color"], { face: string; ink: string }> = {
  azure: { face: "#2B5DF2", ink: "#F7F5F0" },
  or: { face: "#FCDD09", ink: "#141416" },
  gules: { face: "#D50000", ink: "#F7F5F0" },
  mint: { face: "#34c77b", ink: "#141416" },
  sable: { face: "#141416", ink: "#F7F5F0" },
};

/** Deterministic hand-scattered placement, stable across renders. */
const SCATTER_ROTATIONS = [-3, 2.5, -1.5, 3, -2.5, 2];
const SCATTER_MARGINS = ["", "mt-5", "mt-2", "mt-8", "mt-1", "mt-4"];

/**
 * One glossy fridge magnet: domed colour face, inner top highlight, drop
 * shadow. Micro-interaction (brief 6.5): lifts off the door on hover and
 * springs back down, while its shadow stays on the fridge and shifts a
 * touch (y -6, springs.bouncy).
 */
function FridgeMagnet({ award, index }: { award: Award; index: number }) {
  const reduce = useReducedMotion();
  const { face, ink } = FACE_COLORS[award.color];
  const rotate = SCATTER_ROTATIONS[index % SCATTER_ROTATIONS.length];

  const settle: Variants = {
    hidden: { opacity: 0, scale: 0.8, rotate: rotate * 2 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate,
      transition: { ...springs.bouncy, delay: index * 0.06 },
    },
  };

  return (
    <motion.li
      variants={settle}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "visible"}
      whileHover={reduce ? undefined : "hover"}
      viewport={{ once: true, margin: "-40px" }}
      className={`relative w-40 sm:w-44 ${SCATTER_MARGINS[index % SCATTER_MARGINS.length]}`}
    >
      {/* drop shadow: stays on the door while the magnet lifts */}
      <motion.span
        aria-hidden
        variants={{
          visible: { opacity: 1, y: 0, scale: 1 },
          hover: { opacity: 0.5, y: 5, scale: 0.94, transition: springs.bouncy },
        }}
        className="absolute inset-x-3 -bottom-1.5 h-4 rounded-[50%] bg-sable/25 blur-md"
      />
      {/* magnet face */}
      <motion.div
        variants={{
          visible: { y: 0 },
          hover: { y: -6, transition: springs.bouncy },
        }}
        className="relative rounded-2xl p-3.5"
        style={{
          background: `radial-gradient(circle at 30% 16%, rgb(255 255 255 / 0.55), transparent 45%), ${face}`,
          boxShadow:
            "inset 0 2px 3px rgb(255 255 255 / 0.5), inset 0 -8px 14px rgb(0 0 0 / 0.22)",
        }}
      >
        <p
          className="font-display text-[13px] leading-tight font-semibold"
          style={{ color: ink }}
        >
          {award.name}
        </p>
        <p
          className="mt-1.5 text-[11px] font-medium"
          style={{ color: ink, opacity: 0.85 }}
        >
          {award.issuer} · {award.year}
        </p>
        {award.detail && (
          <p
            className="mt-1 text-[11px] leading-snug"
            style={{ color: ink, opacity: 0.7 }}
          >
            {award.detail}
          </p>
        )}
      </motion.div>
    </motion.li>
  );
}

/**
 * Awards (brief section 6.5): honours as glossy magnets scattered on a
 * brushed-steel fridge, freezer seam, slim handle, little feet and all.
 */
export function Awards() {
  // AI fridge final (AI-ASSET-PROMPTS.md C1) replaces the CSS fridge body
  // (grain, seam, handle, feet) when it lands; the magnets stay in code.
  const fridgeSrc = aiAsset("artifacts/fridge");

  return (
    <Section
      id="awards"
      kicker={<Kicker k="awards" />}
      title="The fridge"
      aside="every magnet earned"
    >
      <Reveal>
        <div className="relative mx-auto w-full max-w-2xl">
          {/* fridge door */}
          <div className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,#f6f7f8,#e3e5e7_55%,#d0d3d6)] shadow-[0_20px_50px_rgb(0_0_0/0.18)] dark:border-white/10 dark:shadow-[0_20px_50px_rgb(0_0_0/0.55)]">
            {fridgeSrc ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fridgeSrc}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover"
                />
              </>
            ) : (
              <>
                {/* brushed-metal grain */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-70"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, rgb(255 255 255 / 0.14) 0 1px, transparent 1px 5px), repeating-linear-gradient(90deg, rgb(0 0 0 / 0.03) 0 1px, transparent 1px 7px)",
                  }}
                />
                {/* freezer door seam */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-[23%] h-[3px] bg-[linear-gradient(180deg,rgb(0_0_0/0.16),rgb(255_255_255/0.55))]"
                />
                {/* slim handle */}
                <div
                  aria-hidden
                  className="absolute top-[30%] right-3 h-40 w-2.5 rounded-full bg-[linear-gradient(90deg,#b7bbc0,#e9ebed_50%,#a4a8ae)] shadow-[inset_0_1px_2px_rgb(255_255_255/0.7),0_3px_6px_rgb(0_0_0/0.3)]"
                />
              </>
            )}
            <ul className="relative flex min-h-[520px] flex-wrap content-start items-start justify-center gap-x-5 gap-y-7 p-7 pt-14 sm:min-h-[560px] sm:p-10 sm:pt-16">
              {AWARDS.map((award, i) => (
                <FridgeMagnet key={award.id} award={award} index={i} />
              ))}
            </ul>
          </div>
          {/* little fridge feet (CSS fridge only; baked into the AI final) */}
          {!fridgeSrc && (
            <>
              <div
                aria-hidden
                className="absolute -bottom-1.5 left-10 h-2 w-7 rounded-b-lg bg-steel/80"
              />
              <div
                aria-hidden
                className="absolute -bottom-1.5 right-10 h-2 w-7 rounded-b-lg bg-steel/80"
              />
            </>
          )}
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
