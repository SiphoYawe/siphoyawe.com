"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { PROVERBS, type Proverb as ProverbType } from "@/data/proverbs";

/** Language label, proverb in the handwritten script, a thin gold rule, then
 * the English beneath in the body face. Minimalist, theme-aware. */
function ProverbText({ proverb }: { proverb: ProverbType }) {
  return (
    <>
      <span className="font-sans font-semibold text-[10px] tracking-[0.32em] text-ink-soft uppercase">
        {proverb.lang}
      </span>
      <p className="mt-6 font-hand text-3xl leading-tight text-balance text-ink sm:text-4xl">
        {proverb.text}
      </p>
      {/* one thin gold rule */}
      <span aria-hidden className="mx-auto my-7 block h-px w-16 bg-[#FCDD09]" />
      <p className="mx-auto max-w-md leading-relaxed text-ink-soft">
        {proverb.english}
      </p>
    </>
  );
}

/**
 * Proverb card (brief section 6.13): a rotating Luganda / Runyankole proverb,
 * set as a pure typographic card on the warm paper surface. MICRO: gentle
 * cross-fade (AnimatePresence mode="wait"), auto-advances every 8s, pauses on
 * hover, click advances. Reduced motion swaps instantly.
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

  return (
    <Section
      id="proverb"
      title="A word from home"
      aside="luganda & runyankole"
    >
      <Reveal>
        <div
          className="mx-auto max-w-2xl rounded-3xl border border-line bg-canvas-raised shadow-(--shadow-polaroid)"
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
            className="block w-full cursor-pointer rounded-3xl px-6 py-16 text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:px-14 sm:py-20"
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
            <span className="mt-10 flex items-center justify-center gap-2" aria-hidden>
              {PROVERBS.map((p, i) => (
                <span
                  key={p.id}
                  className={`size-1.5 rounded-full transition-colors ${
                    i === index ? "bg-ink" : "bg-ink/25"
                  }`}
                />
              ))}
            </span>
            <span className="mt-4 block font-hand text-lg text-ink-soft" aria-hidden>
              tap for another
            </span>
          </button>
        </div>
      </Reveal>
    </Section>
  );
}
