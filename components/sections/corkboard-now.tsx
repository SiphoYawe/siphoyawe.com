"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { springs } from "@/lib/motion";
import { aiAsset } from "@/lib/ai-assets";
import { NOW } from "@/data/now";

const PIN_COLORS = ["#D50000", "#2B5DF2", "#FCDD09", "#141416"];
/** Slight per-card lean so the tacks look pressed in by hand, not printed. */
const PIN_TILTS = [-14, 9, -7, 12];

/** A real thumbtack: domed plastic head with a highlight and a short metal
 * pin angling into the cork, casting a tiny contact shadow. */
function Pushpin({ color, tilt }: { color: string; tilt: number }) {
  return (
    <span
      aria-hidden
      className="absolute -top-3 left-1/2 z-20"
      style={{ transform: `translateX(-50%) rotate(${tilt}deg)`, transformOrigin: "50% 100%" }}
    >
      {/* metal pin/neck into the card */}
      <span
        className="absolute top-[9px] left-1/2 h-3.5 w-[3px] -translate-x-1/2 rounded-b-[1px]"
        style={{
          background: "linear-gradient(90deg, #7c7c82, #e6e6ea 45%, #9a9aa0)",
          boxShadow: "0.5px 2px 1.5px rgb(0 0 0 / 0.4)",
        }}
      />
      {/* domed head */}
      <span
        className="relative block size-[15px] rounded-full"
        style={{
          background: `radial-gradient(circle at 32% 28%, rgb(255 255 255 / 0.95) 0 14%, transparent 42%), radial-gradient(circle at 65% 72%, rgb(0 0 0 / 0.35), transparent 55%), ${color}`,
          boxShadow: "0 2px 3px rgb(0 0 0 / 0.45), inset 0 -1.5px 2px rgb(0 0 0 / 0.35)",
        }}
      />
    </span>
  );
}

/**
 * One pinned index card: off-white ruled card, glossy pushpin at top center.
 * Micro-interaction (brief 6.9): swings a few degrees on hover, pivoting on
 * its pin (transform-origin top center, springs.soft).
 */
function PinnedCard({
  card,
  index,
}: {
  card: (typeof NOW.cards)[number];
  index: number;
}) {
  const reduce = useReducedMotion();
  const pin = PIN_COLORS[index % PIN_COLORS.length];

  return (
    <motion.li
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "visible"}
      whileHover={reduce ? undefined : "hover"}
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: { opacity: 0, y: 14, rotate: card.rotate * 2 },
        visible: {
          opacity: 1,
          y: 0,
          rotate: card.rotate,
          transition: { ...springs.soft, delay: index * 0.07 },
        },
        hover: { rotate: card.rotate + 3.5, transition: springs.soft },
      }}
      style={{ transformOrigin: "50% 0%" }}
      className="relative"
    >
      {/* pushpin */}
      <Pushpin color={pin} tilt={PIN_TILTS[index % PIN_TILTS.length]} />
      {/* ruled index card */}
      <div
        className="min-h-[160px] rounded-[3px] bg-[#fbf8ec] p-4 pt-6 shadow-[0_3px_8px_rgb(0_0_0/0.3)]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0 26px, rgb(43 93 242 / 0.16) 26px 27px)",
        }}
      >
        <p className="font-sans text-[10px] font-bold tracking-[0.14em] text-azure-deep uppercase">
          {card.label}
        </p>
        <p className="mt-1.5 font-hand text-xl leading-snug text-[#38352c]">{card.text}</p>
      </div>
    </motion.li>
  );
}

/**
 * Corkboard "Now" page (brief section 6.9): pinned index cards on a grained
 * cork board with a wooden frame, a red string between the pins, and an ink
 * stamp with the last-updated date.
 */
export function CorkboardNow() {
  // AI corkboard final (AI-ASSET-PROMPTS.md C6): a wooden-framed cork board,
  // transparent PNG. It IS the object — no extra card or frame behind it. The
  // cards, pins, string and updated stamp overlay the cork in code.
  const corkSrc = aiAsset("artifacts/corkboard");

  // The pinned cards, shared by both the AI-asset and CSS-fallback layouts.
  const cards = (
    <ul className="relative grid gap-x-6 gap-y-8 pt-4 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4">
      {NOW.cards.map((card, i) => (
        <PinnedCard key={card.id} card={card} index={i} />
      ))}
    </ul>
  );

  // The ink stamp — knocked out on a cream chip so it reads clearly on cork.
  const stampClass =
    "pointer-events-none inline-block -rotate-6 rounded-md border-[2.5px] border-[#c40000] bg-[#f7efe0]/90 px-2.5 py-1 font-sans text-[10px] font-extrabold tracking-[0.2em] text-[#c40000] uppercase shadow-sm sm:text-[11px]";
  // Absolute, tucked in the corner for the framed desktop board.
  const stamp = (
    <p className={`absolute right-4 bottom-7 sm:right-6 sm:bottom-9 ${stampClass}`}>
      updated {NOW.updated}
    </p>
  );
  // Inline, sits after the cards on the flowing mobile board.
  const stampInline = (
    <p className="mt-6 flex justify-end">
      <span className={stampClass}>updated {NOW.updated}</span>
    </p>
  );

  return (
    <Section
      id="now"
      title="My current focus"
      aside="updated periodically"
    >
      <Reveal>
        {corkSrc ? (
          <>
            {/* Desktop: the framed cork asset sizes the board and the four
                cards sit in a row inside its wooden frame. */}
            <div className="relative mx-auto hidden w-full max-w-4xl lg:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={corkSrc}
                alt=""
                loading="lazy"
                className="pointer-events-none block w-full select-none"
              />
              <div className="absolute inset-x-[6%] inset-y-[8%] flex flex-col justify-center">
                {cards}
                {stamp}
              </div>
            </div>
            {/* Mobile/tablet: the framed landscape asset is too short to hold
                readable stacked cards, so the cork fills a board that grows
                with the cards (object-cover crops the frame, texture stays). */}
            <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl shadow-(--shadow-lift) lg:hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={corkSrc}
                alt=""
                aria-hidden
                loading="lazy"
                className="pointer-events-none absolute inset-0 size-full select-none object-cover"
              />
              <div className="relative px-5 py-8 sm:px-8 sm:py-10">
                {cards}
                {stampInline}
              </div>
            </div>
          </>
        ) : (
          // CSS fallback: hand-built wooden frame + cork texture.
          <div className="relative mx-auto w-full max-w-4xl rounded-2xl bg-[linear-gradient(160deg,#7a5636,#583b20)] p-2.5 shadow-[0_18px_44px_rgb(0_0_0/0.28)] sm:p-3 dark:shadow-[0_18px_44px_rgb(0_0_0/0.6)]">
            <div
              className="relative rounded-xl p-8 pt-12 pb-16 shadow-[inset_0_2px_14px_rgb(0_0_0/0.35)] sm:p-12 sm:pt-14 sm:pb-20"
              style={{
                backgroundColor: "#b5855c",
                backgroundImage:
                  "radial-gradient(circle at 25% 30%, rgb(90 60 35 / 0.28) 0 1.5px, transparent 1.5px), radial-gradient(circle at 70% 65%, rgb(255 225 180 / 0.22) 0 1.5px, transparent 1.5px), radial-gradient(circle at 45% 80%, rgb(90 60 35 / 0.2) 0 1px, transparent 1px), linear-gradient(160deg, #c1916a, #a67a4e)",
                backgroundSize: "90px 90px, 70px 70px, 50px 50px, 100% 100%",
              }}
            >
              {cards}              {stamp}
            </div>
          </div>
        )}
      </Reveal>
    </Section>
  );
}
