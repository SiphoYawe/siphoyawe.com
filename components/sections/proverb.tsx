"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Kicker } from "@/components/ui/kicker";
import { Reveal } from "@/components/ui/reveal";
import { aiAsset } from "@/lib/ai-assets";
import { PROVERBS, type Proverb as ProverbType } from "@/data/proverbs";

/**
 * Kitenge / barkcloth frame, woven in CSS: cream warp threads over a
 * diamond check (conic-gradient) in the brand tinctures on a warm base.
 * Fixed hexes: it is a cloth artifact, so it reads the same in both themes.
 * The AI kitenge tile (AI-ASSET-PROMPTS.md F1) replaces it when the final
 * lands, as a cover background on the same frame element.
 */
const KITENGE_STYLE: React.CSSProperties = {
  background: [
    "repeating-linear-gradient(45deg, transparent 0 22px, rgb(247 245 240 / 0.22) 22px 24px)",
    "repeating-linear-gradient(-45deg, transparent 0 22px, rgb(20 20 22 / 0.16) 22px 24px)",
    "conic-gradient(from 45deg, #D50000 0 25%, #FCDD09 0 50%, #2B5DF2 0 75%, #141416 0)",
  ].join(", "),
  backgroundSize: "auto, auto, 26px 26px",
  backgroundColor: "#a97b50",
};

/** Cover-fit the generated kitenge tile on the frame. */
function kitengeImageStyle(src: string): React.CSSProperties {
  return {
    backgroundImage: `url(${src})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

/** Chip + proverb + English, set on the cream paper panel. */
function ProverbText({ proverb }: { proverb: ProverbType }) {
  return (
    <>
      <span className="inline-block rounded-full border border-[#D50000]/60 px-3 py-1 font-heraldic text-[10px] tracking-[0.3em] text-[#A30000] uppercase">
        {proverb.lang}
      </span>
      <p className="mt-5 font-display text-2xl font-semibold tracking-tight text-balance text-[#141416] sm:text-3xl">
        {proverb.text}
      </p>
      <p className="mt-4 font-heraldic text-xs tracking-[0.22em] text-[#6b675f] uppercase sm:text-sm">
        {proverb.english}
      </p>
    </>
  );
}

/**
 * Proverb card (brief section 6.13): a rotating Luganda / Runyankole proverb
 * on kitenge cloth. MICRO: gentle cross-fade (AnimatePresence mode="wait"),
 * auto-advances every 8s, pauses on hover, click advances. Reduced motion
 * swaps instantly.
 */
export function Proverb() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0); // bump to restart the 8s clock

  const advance = useCallback(() => setIndex((i) => (i + 1) % PROVERBS.length), []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(advance, 8000);
    return () => window.clearInterval(timer);
  }, [paused, cycle, advance]);

  const current = PROVERBS[index];
  const kitengeSrc = aiAsset("textures/kitenge");

  return (
    <Section
      id="proverb"
      kicker={<Kicker k="proverb" />}
      title="A word from home"
      aside="luganda & runyankole"
    >
      <Reveal>
        <div
          className="mx-auto max-w-2xl rounded-[1.75rem] p-3 shadow-(--shadow-polaroid) sm:p-4"
          style={kitengeSrc ? kitengeImageStyle(kitengeSrc) : KITENGE_STYLE}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <button
            type="button"
            onClick={() => {
              advance();
              setCycle((c) => c + 1);
            }}
            aria-label="Show another proverb"
            className="block w-full cursor-pointer rounded-2xl bg-[#FBF7EC] px-6 py-10 text-center shadow-[inset_0_0_0_1px_rgb(20_20_22/0.08)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:px-12 sm:py-12"
          >
            {reduce ? (
              <ProverbText proverb={current} />
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={current.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="block"
                >
                  <ProverbText proverb={current} />
                </motion.span>
              </AnimatePresence>
            )}
            <span className="mt-8 flex items-center justify-center gap-2" aria-hidden>
              {PROVERBS.map((p, i) => (
                <span
                  key={p.id}
                  className={`size-1.5 rounded-full transition-colors ${
                    i === index ? "bg-[#141416]" : "bg-[#141416]/25"
                  }`}
                />
              ))}
            </span>
            <span className="mt-4 block font-hand text-lg text-[#6b675f]" aria-hidden>
              tap for another
            </span>
          </button>
        </div>
      </Reveal>
    </Section>
  );
}
