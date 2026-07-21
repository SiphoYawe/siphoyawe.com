"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Kicker } from "@/components/ui/kicker";
import { Reveal } from "@/components/ui/reveal";
import { springs } from "@/lib/motion";
import { BOOKS, BIBLE, type Book } from "@/data/books";

const SPINE_STYLES: Record<Book["spine"], { bg: string; ink: string }> = {
  azure: { bg: "#2B5DF2", ink: "#F7F5F0" },
  or: { bg: "#FCDD09", ink: "#141416" },
  gules: { bg: "#D50000", ink: "#F7F5F0" },
  mint: { bg: "#34c77b", ink: "#141416" },
  sable: { bg: "#141416", ink: "#FCDD09" },
};

/** Hand-varied heights and widths, so the shelf looks shelved, not rendered. */
const BOOK_SIZES = ["h-40 w-11", "h-48 w-12", "h-44 w-10"];

/** The phrase that gets the soft yellow highlighter when the Bible opens. */
const HIGHLIGHT_PHRASE = "he will establish your plans";

/**
 * One standing spine on the shelf. Micro-interaction (brief section 6.6):
 * eases forward off the shelf on hover, a small lift and tilt on a soft
 * spring. The current read wears the red ribbon bookmark past the shelf edge.
 */
function ShelfBook({ book, index }: { book: Book; index: number }) {
  const reduce = useReducedMotion();
  const { bg, ink } = SPINE_STYLES[book.spine];

  return (
    <motion.li
      whileHover={reduce ? undefined : { y: -6, rotate: -2 }}
      transition={springs.soft}
      className={`relative z-10 flex ${BOOK_SIZES[index % BOOK_SIZES.length]} cursor-default flex-col items-center justify-between rounded-t-[3px] px-1.5 pt-2.5 pb-2`}
      style={{
        background: `linear-gradient(90deg, rgb(0 0 0 / 0.28), transparent 20%, rgb(255 255 255 / 0.16) 46%, transparent 68%, rgb(0 0 0 / 0.32)), ${bg}`,
        boxShadow: "0 3px 5px rgb(0 0 0 / 0.3)",
      }}
    >
      {book.current && (
        <span
          aria-hidden
          className="absolute top-0 left-1/2 w-1.5 -translate-x-1/2 bg-gules shadow-sm"
          style={{
            height: "calc(100% + 30px)",
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 6px), 0 100%)",
          }}
        />
      )}
      {/* binding bands */}
      <span aria-hidden className="flex w-full flex-col gap-1">
        <span className="h-px w-full" style={{ background: ink, opacity: 0.45 }} />
        <span className="h-px w-full" style={{ background: ink, opacity: 0.45 }} />
      </span>
      <span
        className="flex-1 overflow-hidden pt-2 text-[10px] font-semibold tracking-[0.14em] uppercase [writing-mode:vertical-rl]"
        style={{ color: ink }}
      >
        {book.title}
      </span>
      <span
        className="pt-1 text-[7px] tracking-[0.12em] uppercase opacity-80 [writing-mode:vertical-rl]"
        style={{ color: ink }}
      >
        {book.author}
      </span>
    </motion.li>
  );
}

/**
 * The Bible as its own well-worn artifact (brief section 6.6): thick sable
 * cover, gold heraldic emboss, a visible page-edge block. Its one moment is
 * the open: tap to spread two cream pages with the life verse highlighted.
 */
function BibleArtifact() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  const verse = BIBLE.verse;
  const hi = verse.indexOf(HIGHLIGHT_PHRASE);
  const swap = reduce ? { duration: 0.01 } : springs.soft;

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close the Bible" : "Open the Bible to read the life verse"}
        className="flex h-56 w-full max-w-80 cursor-pointer items-end justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:h-60"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div
              key="open"
              initial={reduce ? false : { opacity: 0, scale: 0.92, rotate: 1.5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, rotate: -1 }}
              transition={swap}
              className="relative w-full max-w-72"
            >
              {/* page block peeking out under the open spread */}
              <span aria-hidden className="absolute inset-x-1 -bottom-1.5 h-2.5 rounded-b-md bg-[#e6ddc4]" />
              <div className="relative grid h-44 grid-cols-2 overflow-hidden rounded-md shadow-(--shadow-lift)">
                {/* left page: the verse, key phrase highlighted */}
                <div className="flex flex-col justify-center bg-[#f6f0dd] p-4 shadow-[inset_-16px_0_18px_-16px_rgb(0_0_0/0.35)]">
                  <p className="font-heraldic text-[9px] tracking-[0.3em] text-[#8a7f63] uppercase">
                    The life verse
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#3a352a]">
                    {hi >= 0 ? (
                      <>
                        {verse.slice(0, hi)}
                        <mark className="rounded-sm bg-or/50 px-0.5 text-inherit">
                          {HIGHLIGHT_PHRASE}
                        </mark>
                        {verse.slice(hi + HIGHLIGHT_PHRASE.length)}
                      </>
                    ) : (
                      verse
                    )}
                  </p>
                </div>
                {/* right page: reference, heraldic */}
                <div className="flex flex-col items-center justify-center gap-2.5 bg-[#f2ebd5] p-4 text-center shadow-[inset_16px_0_18px_-16px_rgb(0_0_0/0.35)]">
                  <svg viewBox="0 0 24 24" aria-hidden className="size-4 text-or">
                    <path
                      d="M11 2h2v6h6v2h-6v12h-2V10H5V8h6z"
                      fill="currentColor"
                    />
                  </svg>
                  <p className="font-heraldic text-sm tracking-[0.22em] text-[#3a352a] uppercase">
                    {BIBLE.reference}
                  </p>
                  <p className="text-[10px] tracking-[0.2em] text-[#8a7f63] uppercase">
                    {BIBLE.translation}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="closed"
              initial={reduce ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, rotate: 1.5 }}
              transition={swap}
              className="relative h-44 w-32 -rotate-1"
            >
              {/* page-edge block on the right side */}
              <span
                aria-hidden
                className="absolute top-1 right-0 bottom-1 w-1.5 rounded-r-sm"
                style={{
                  background:
                    "repeating-linear-gradient(180deg, #efe8d2 0 2px, #ded4b8 2px 3px)",
                }}
              />
              {/* sable cover, gold emboss */}
              <span
                className="absolute inset-y-0 right-1.5 left-0 flex flex-col items-center justify-center gap-3 rounded-[6px] rounded-r-[3px] border border-black/60"
                style={{
                  background:
                    "radial-gradient(circle at 30% 20%, rgb(255 255 255 / 0.07), transparent 55%), #171512",
                  boxShadow:
                    "0 10px 20px rgb(0 0 0 / 0.4), inset 0 1px 0 rgb(255 255 255 / 0.08)",
                }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-1.5 rounded-[4px] border border-or/40"
                />
                <svg viewBox="0 0 24 24" aria-hidden className="size-4 text-or/90">
                  <path d="M11 2h2v6h6v2h-6v12h-2V10H5V8h6z" fill="currentColor" />
                </svg>
                <span className="px-3 text-center font-heraldic text-[11px] leading-relaxed tracking-[0.28em] text-or uppercase">
                  Holy
                  <br />
                  Bible
                </span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
      <p aria-hidden className="-rotate-2 font-hand text-lg text-ink-soft">
        {open ? "tap again to close" : "tap to open"}
      </p>
    </div>
  );
}

/**
 * Currently Reading (brief section 6.6): 3D book mockups on a wooden shelf,
 * the current read ribboned in red, and the Bible beside it as the
 * scripture-as-object moment.
 */
export function Reading() {
  return (
    <Section
      id="reading"
      kicker={<Kicker k="reading" />}
      title="The shelf"
      aside="the bible stays"
    >
      <Reveal>
        <div className="flex flex-col items-center gap-14 sm:flex-row sm:items-end sm:justify-center sm:gap-20">
          {/* the shelf */}
          <div className="relative">
            <ol className="flex items-end gap-2.5 px-3">
              {BOOKS.map((book, i) => (
                <ShelfBook key={book.id} book={book} index={i} />
              ))}
            </ol>
            {/* wooden plank: warm gradient, lit front edge, soft shadow under */}
            <div
              aria-hidden
              className="-mx-3 h-4 rounded-[3px]"
              style={{
                background:
                  "linear-gradient(180deg, #c08a5c 0%, #9c6a41 45%, #7b4f2d 100%)",
                boxShadow:
                  "inset 0 1.5px 0 rgb(255 220 170 / 0.55), 0 18px 26px -12px rgb(0 0 0 / 0.4)",
              }}
            />
          </div>

          <BibleArtifact />
        </div>
      </Reveal>
    </Section>
  );
}
