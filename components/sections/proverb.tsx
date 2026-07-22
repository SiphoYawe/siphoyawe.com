"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { springs } from "@/lib/motion";
import { PROVERBS, type Proverb as ProverbType } from "@/data/proverbs";

/** Warm legal-pad surface: yellow paper, ruled blue-grey lines, a red margin
 * rule down the left. Shared by the live top card and the peeking stack. */
const PAD_STYLE: React.CSSProperties = {
  backgroundColor: "#f6e6a0",
  backgroundImage:
    "repeating-linear-gradient(to bottom, transparent 0 31px, rgb(70 104 168 / 0.28) 31px 32px), linear-gradient(90deg, transparent 0 2.5rem, rgb(213 0 0 / 0.4) 2.5rem calc(2.5rem + 1.5px), transparent calc(2.5rem + 1.5px))",
  backgroundPosition: "0 3.25rem, 0 0",
};

/** The proverb written on the ruled lines, translation beneath, a thin gold
 * rule, and the language noted like a pencil scribble in the corner. */
function PadFace({ proverb }: { proverb: ProverbType }) {
  return (
    <div
      className="relative min-h-[15rem] overflow-hidden rounded-md shadow-(--shadow-lift) sm:min-h-[16rem]"
      style={PAD_STYLE}
    >
      {/* torn/glued top edge hint */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-3 bg-[repeating-linear-gradient(90deg,rgb(0_0_0/0.06)_0_6px,transparent_6px_12px)]"
      />
      {/* language pencil note, top-right corner */}
      <span className="absolute top-4 right-5 -rotate-3 font-hand text-base text-[#6b5a1e]">
        {proverb.lang.toLowerCase()}
      </span>
      <div className="px-8 pt-14 pb-9 pl-14 text-center sm:px-12 sm:pl-16">
        <p className="font-hand text-[2rem] leading-[2rem] text-[#2c2a20] sm:text-4xl sm:leading-[2.05rem]">
          {proverb.text}
        </p>
        <span aria-hidden className="mx-auto my-6 block h-px w-16 bg-[#caa300]" />
        <p className="mx-auto max-w-md leading-relaxed text-[#5a5330]">{proverb.english}</p>
      </div>
    </div>
  );
}

/**
 * Proverb rolodex (brief section 6.13): a stack of yellow legal-pad cards, the
 * active one on top with two more peeking behind. Tap flicks the top card up
 * and off, revealing the next; it cycles and auto-advances every 8s (pauses on
 * hover). Reduced motion swaps with a plain cross-fade.
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
  if (!current) return null; // hidden until PROVERBS is repopulated

  return (
    <Section id="proverb" title="Wise sayings from home" aside="luganda">
      <Reveal>
        <div
          className="mx-auto max-w-xl"
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
            className="block w-full cursor-pointer rounded-xl focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent"
          >
            {/* the stack: two static cards peeking behind the live one */}
            <div className="relative">
              <span
                aria-hidden
                className="absolute inset-x-3 top-3 -bottom-3 rotate-[3deg] rounded-md shadow-(--shadow-polaroid)"
                style={PAD_STYLE}
              />
              <span
                aria-hidden
                className="absolute inset-x-1.5 top-1.5 -bottom-1.5 -rotate-[2deg] rounded-md shadow-(--shadow-polaroid)"
                style={PAD_STYLE}
              />

              {reduce ? (
                <PadFace proverb={current} />
              ) : (
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 24, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, y: -150, rotate: -9, transition: { ...springs.snappy } }}
                    transition={springs.soft}
                    className="relative"
                  >
                    <PadFace proverb={current} />
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </button>

          {/* progress dots */}
          <span className="mt-8 flex items-center justify-center gap-2" aria-hidden>
            {PROVERBS.map((p, i) => (
              <span
                key={p.id}
                className={`size-1.5 rounded-full transition-colors ${
                  i === index ? "bg-ink" : "bg-ink/25"
                }`}
              />
            ))}
          </span>
          <p className="mt-3 text-center font-hand text-lg text-ink-soft" aria-hidden>
            tap for another
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
