"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { springs } from "@/lib/motion";
import { BOOKS, BIBLE, type Book } from "@/data/books";
import { aiAsset } from "@/lib/ai-assets";

const SPINE_STYLES: Record<Book["spine"], { bg: string; ink: string }> = {
  azure: { bg: "#2B5DF2", ink: "#F7F5F0" },
  or: { bg: "#FCDD09", ink: "#141416" },
  gules: { bg: "#D50000", ink: "#F7F5F0" },
  mint: { bg: "#34c77b", ink: "#141416" },
  sable: { bg: "#141416", ink: "#FCDD09" },
};

/** Slight per-book lean so the shelf looks shelved, not rendered. */
const BOOK_TILTS = [-2, 1.5, -1, 2];

/** The phrase that gets the soft yellow highlighter when the Bible opens. */
const HIGHLIGHT_PHRASE = "he will establish your plans";

/**
 * One front-facing book cover standing on the shelf. Micro-interaction (brief
 * section 6.6): eases forward off the shelf on hover, a small lift and tilt on
 * a soft spring.
 * Renders a real cover image when present, a typographic placeholder otherwise.
 */
function ShelfBook({ book, index }: { book: Book; index: number }) {
  const reduce = useReducedMotion();
  const { bg, ink } = SPINE_STYLES[book.spine];
  const tilt = BOOK_TILTS[index % BOOK_TILTS.length];

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={reduce ? undefined : { y: -10, rotate: 0, scale: 1.03 }}
      transition={{ ...springs.soft, delay: index * 0.06 }}
      style={{ rotate: `${tilt}deg` }}
      className="relative z-10 -mx-1 cursor-default"
    >
      <div
        className="relative h-44 w-28 overflow-hidden rounded-[2px] rounded-r-[4px] shadow-[0_10px_18px_-8px_rgb(0_0_0/0.55)]"
        style={{ background: bg }}
      >
        {book.coverImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={book.coverImage} alt={`${book.title} cover`} loading="lazy" className="size-full object-cover" />
        ) : (
          /* typographic placeholder cover */
          <div className="flex h-full flex-col justify-between p-4" style={{ color: ink }}>
            <p className="text-[13px] leading-tight font-bold" style={{ fontFamily: "var(--font-display)" }}>
              {book.title}
            </p>
            <p className="text-[9px] font-semibold tracking-[0.14em] uppercase opacity-85">{book.author}</p>
          </div>
        )}
        {/* spine shadow at the binding + cover sheen */}
        <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/35 to-transparent" />
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-black/10" />
      </div>
      {/* page-block thickness on the right edge */}
      <span
        aria-hidden
        className="absolute inset-y-1 -right-1 w-1.5 rounded-r-[2px]"
        style={{ background: "repeating-linear-gradient(180deg, #efe8d2 0 2px, #ded4b8 2px 3px)" }}
      />
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
  // AI Bible object (AI-ASSET-PROMPTS.md C3) replaces the CSS closed state
  // when it lands; the tap-to-open cream spread stays code either way.
  const bibleSrc = aiAsset("artifacts/bible");

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close the Bible" : "Open the Bible to read the life verse"}
        className="flex min-h-[17rem] cursor-pointer items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:min-h-[19rem]"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div
              key="open"
              initial={reduce ? false : { opacity: 0, scale: 0.92, rotate: 1.5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, rotate: -1 }}
              transition={swap}
              className="relative w-[20rem] sm:w-[29rem]"
            >
              {/* page block peeking out under the open spread */}
              <span aria-hidden className="absolute inset-x-2 -bottom-2 h-3 rounded-b-lg bg-[#e6ddc4]" />
              <div className="relative grid grid-cols-2 overflow-hidden rounded-lg shadow-(--shadow-lift)">
                {/* centre fold */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-3 -translate-x-1/2 bg-gradient-to-r from-black/0 via-black/25 to-black/0"
                />
                {/* left page: the verse, key phrase highlighted */}
                <div className="flex min-h-[13.5rem] flex-col justify-center bg-[#f6f0dd] px-5 py-6 shadow-[inset_-18px_0_20px_-16px_rgb(0_0_0/0.35)] sm:min-h-[15.5rem] sm:px-7">
                  <p className="font-sans text-[9px] font-semibold tracking-[0.28em] text-[#8a7f63] uppercase">
                    The life verse
                  </p>
                  <p className="mt-3 text-[13px] leading-relaxed text-[#3a352a] sm:text-[14px] sm:leading-[1.7]">
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
                {/* right page: gold cross + reference */}
                <div className="flex min-h-[13.5rem] flex-col items-center justify-center gap-3 bg-[#f2ebd5] px-5 py-6 text-center shadow-[inset_18px_0_20px_-16px_rgb(0_0_0/0.35)] sm:min-h-[15.5rem] sm:px-7">
                  <svg viewBox="0 0 24 24" aria-hidden className="size-6 text-or drop-shadow-sm sm:size-7">
                    <path d="M11 2h2v6h6v2h-6v12h-2V10H5V8h6z" fill="currentColor" />
                  </svg>
                  <p className="font-hand text-2xl leading-tight text-[#3a352a] sm:text-3xl">
                    {BIBLE.reference}
                  </p>
                  <p className="font-sans text-[10px] font-semibold tracking-[0.22em] text-[#8a7f63] uppercase">
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
              {bibleSrc ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={bibleSrc}
                  alt=""
                  loading="lazy"
                  className="size-full object-contain drop-shadow-xl"
                />
              ) : (
              <>
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
              </>
              )}
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
 * with the Bible beside it as the scripture-as-object moment.
 */
export function Reading() {
  // AI walnut shelf photo (AI-ASSET-PROMPTS.md C2) replaces the CSS plank
  // when it lands; the books keep standing on it in code either way.
  const bookshelfSrc = aiAsset("artifacts/bookshelf");
  return (
    <Section
      id="reading"
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
            {/* shelf plank: AI photo when present, CSS plank otherwise */}
            {bookshelfSrc ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={bookshelfSrc}
                alt=""
                loading="lazy"
                className="-mx-3 h-auto w-[calc(100%+1.5rem)] max-w-none object-contain drop-shadow-lg"
              />
            ) : (
              /* wooden plank: warm gradient, lit front edge, soft shadow under */
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
            )}
          </div>

          <BibleArtifact />
        </div>
      </Reveal>
    </Section>
  );
}
