"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { springs } from "@/lib/motion";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import {
  AnkoleCattle,
  CoffeeSticker,
  CraneFeather,
  CrownSticker,
  DoveSticker,
  HelloTag,
  LedgerNod,
  LionSticker,
  UgandaPin,
} from "./stickers";

type StickerSpec = {
  Art: (props: { className?: string }) => React.ReactNode;
  /** Resting rotation of the popped sticker. */
  rotate: number;
  /** Tailwind size for the die-cut wrapper. */
  size: string;
  /** Lift above the letter, as a fraction of letter height. */
  lift?: number;
};

/**
 * SIPHO YAWE, one hover target per letter (danielsun hero-sticker forensics).
 * The set: crane feather, HELLO tag, Ledger/Solidity nod, Ankole cattle,
 * Uganda flag pin, gold lion crest, the hidden dove, Kampala coffee, YHWH
 * crown. This is the easter-egg benchmark — the site's second loud moment.
 */
const LETTERS: { char: string; sticker: StickerSpec; egg: string }[] = [
  { char: "S", sticker: { Art: CraneFeather, rotate: -12, size: "size-14 sm:size-20" }, egg: "hero-sticker:crane-feather" },
  { char: "I", sticker: { Art: HelloTag, rotate: 7, size: "h-11 w-16 sm:h-16 sm:w-24" }, egg: "hero-sticker:hello-tag" },
  { char: "P", sticker: { Art: LedgerNod, rotate: -7, size: "h-12 w-16 sm:h-16 sm:w-24" }, egg: "hero-sticker:ledger" },
  { char: "H", sticker: { Art: AnkoleCattle, rotate: 10, size: "size-14 sm:size-20" }, egg: "hero-sticker:ankole" },
  { char: "O", sticker: { Art: UgandaPin, rotate: -9, size: "size-14 sm:size-20" }, egg: "hero-sticker:uganda-pin" },
  { char: "Y", sticker: { Art: LionSticker, rotate: 6, size: "size-14 sm:size-20" }, egg: "hero-sticker:lion" },
  { char: "A", sticker: { Art: DoveSticker, rotate: -10, size: "size-14 sm:size-20", lift: 0.85 }, egg: "hero-sticker:hidden-dove" },
  { char: "W", sticker: { Art: CoffeeSticker, rotate: 11, size: "size-14 sm:size-20" }, egg: "hero-sticker:coffee" },
  { char: "E", sticker: { Art: CrownSticker, rotate: -6, size: "size-14 sm:size-20" }, egg: "hero-sticker:crown" },
];

function StickerLetter({
  char,
  sticker,
  round,
  egg,
}: {
  char: string;
  sticker: StickerSpec;
  round: boolean;
  egg: string;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const { Art, rotate, size, lift = 0.72 } = sticker;

  const reveal = () => {
    setOpen((was) => {
      if (!was) trackEvent(AnalyticsEvents.EasterEgg, { egg });
      return true;
    });
  };

  return (
    <span
      className="relative inline-block outline-none"
      onMouseEnter={reveal}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)} // touch support
      onFocus={reveal}
      onBlur={() => setOpen(false)}
      tabIndex={0}
      aria-label={`Letter ${char}, hides a sticker`}
    >
      {char}
      <AnimatePresence>
        {open && (
          <motion.span
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0, rotate: rotate * 2.5, y: 14 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, rotate, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.4, rotate: rotate * 2, y: 8, transition: { duration: 0.14 } }}
            transition={springs.bouncy}
            style={{ bottom: `${lift * 100}%` }}
            className={`pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 ${
              round ? "rounded-full" : "rounded-xl"
            } border border-line bg-white p-1.5 shadow-(--shadow-lift) ${size}`}
          >
            <Art className="size-full" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export function Wordmark() {
  return (
    <h1
      aria-label="Sipho Yawe"
      className="relative z-10 w-screen max-w-none -translate-x-[2%] text-center font-display text-[clamp(4.5rem,18vw,21rem)] leading-[0.82] font-semibold tracking-[-0.03em] whitespace-nowrap text-sable select-none dark:text-paper"
    >
      <span aria-hidden className="inline-flex items-baseline justify-center">
        {LETTERS.slice(0, 5).map(({ char, sticker, egg }) => (
          <StickerLetter key={char} char={char} sticker={sticker} egg={egg} round={char !== "I" && char !== "P"} />
        ))}
        <span className="inline-block w-[0.28em]" />
        {LETTERS.slice(5).map(({ char, sticker, egg }) => (
          <StickerLetter key={char} char={char} sticker={sticker} egg={egg} round={char !== "W"} />
        ))}
      </span>
    </h1>
  );
}
