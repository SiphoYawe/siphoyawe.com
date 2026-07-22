"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { springs } from "@/lib/motion";
import { WATCHES, type Watch } from "@/data/watches";
import { aiAsset } from "@/lib/ai-assets";
import { useCoarsePointer } from "@/lib/use-coarse-pointer";

const TONES: Record<Watch["tone"], { face: string; strap: string; hand: string }> = {
  azure: { face: "#2B5DF2", strap: "#1e46c8", hand: "#F7F5F0" },
  or: { face: "#FCDD09", strap: "#b89307", hand: "#141416" },
  sable: { face: "#141416", strap: "#26262b", hand: "#F7F5F0" },
  steel: { face: "#848484", strap: "#5c5c60", hand: "#141416" },
};

/** Hand angle pairs (deg from 12) for the placeholder faces, classic 10:10. */
const HOUR_DEG = 305;
const MINUTE_DEG = 60;
const SECOND_DEG = 170;

/**
 * One watch resting in its slot: strap arcs above and below a toned dial
 * with simple hands and a crown nub. Micro-interaction (brief section 6.7):
 * lifts and rotates slightly out of the slot on hover, bouncy spring.
 */
function WatchPiece({ watch, slotX, index = 0 }: { watch: Watch; slotX?: string; index?: number }) {
  const reduce = useReducedMotion();
  const coarse = useCoarsePointer();
  const [imgError, setImgError] = useState(false);
  const [open, setOpen] = useState(false);
  // On touch there is no hover, so tapping the watch toggles its tooltip. On a
  // mouse the handler is a no-op (hover already reveals it, so a click never
  // leaves the tooltip stuck open).
  const toggle = () => coarse && setOpen((v) => !v);
  const tone = TONES[watch.tone];
  const strapBg = `linear-gradient(90deg, rgb(0 0 0 / 0.35), transparent 30%, rgb(255 255 255 / 0.12) 50%, transparent 70%, rgb(0 0 0 / 0.35)), ${tone.strap}`;
  const showImg = Boolean(watch.image) && !imgError;

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ ...springs.soft, delay: 0.15 + index * 0.13 }}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen((v) => !v);
        }
      }}
      className={
        slotX
          ? "group absolute flex w-[32%] -translate-x-1/2 cursor-pointer flex-col items-center text-center outline-none"
          : "group flex cursor-pointer flex-col items-center text-center outline-none"
      }
      style={slotX ? { left: slotX, top: "30%" } : undefined}
    >
      {/* the watch seated in its slot on the leather. On mobile the roll is
          narrower, so the watch scales with the viewport (vw) to stay inside
          its velvet slot; from sm up it settles to a fixed height. */}
      <div className="relative flex h-[30vw] w-full items-center justify-center sm:h-44 md:h-48">
        {/* soft contact shadow on the leather */}
        <span
          aria-hidden
          className="absolute bottom-2 h-3 w-16 rounded-[50%] bg-black/45 blur-md sm:bottom-4 sm:h-3.5 sm:w-24"
        />
        {showImg ? (
          <motion.div
            whileHover={reduce ? undefined : { y: -8 }}
            transition={springs.bouncy}
            className={`relative cursor-default ${watch.wishlist ? "opacity-50 grayscale" : ""}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={watch.image}
              alt={`${watch.brand} ${watch.model}`}
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-[25vw] w-auto object-contain drop-shadow-[0_10px_14px_rgb(0_0_0/0.5)] sm:h-40 md:h-44"
            />
          </motion.div>
        ) : (
        <motion.div
          whileHover={reduce ? undefined : { y: -8, rotate: 2 }}
          transition={springs.bouncy}
          className={`flex cursor-default flex-col items-center ${
            watch.wishlist ? "opacity-45 grayscale" : ""
          }`}
        >
          <span aria-hidden className="h-8 w-12 rounded-t-md" style={{ background: strapBg }} />
          {/* dial */}
          <span
            aria-hidden
            className="relative block size-24 rounded-full sm:size-28"
            style={{
              background: `radial-gradient(circle at 34% 30%, rgb(255 255 255 / 0.22), transparent 45%), ${tone.face}`,
              boxShadow:
                "0 0 0 3px #c9c9cf, 0 0 0 4.5px #8e8e96, 0 6px 12px rgb(0 0 0 / 0.45), inset 0 -5px 10px rgb(0 0 0 / 0.3)",
            }}
          >
            {/* ticks at 12 / 3 / 6 / 9 */}
            {[0, 90, 180, 270].map((deg) => (
              <span key={deg} className="absolute inset-2" style={{ transform: `rotate(${deg}deg)` }}>
                <span
                  className="absolute top-0 left-1/2 h-2 w-0.5 -translate-x-1/2"
                  style={{ background: tone.hand, opacity: 0.75 }}
                />
              </span>
            ))}
            {/* hour hand */}
            <span className="absolute inset-0" style={{ transform: `rotate(${HOUR_DEG}deg)` }}>
              <span
                className="absolute top-[26%] left-1/2 h-[24%] w-[3px] -translate-x-1/2 rounded-full"
                style={{ background: tone.hand }}
              />
            </span>
            {/* minute hand */}
            <span className="absolute inset-0" style={{ transform: `rotate(${MINUTE_DEG}deg)` }}>
              <span
                className="absolute top-[16%] left-1/2 h-[34%] w-[2px] -translate-x-1/2 rounded-full"
                style={{ background: tone.hand }}
              />
            </span>
            {/* second hand, gules spark */}
            <span className="absolute inset-0" style={{ transform: `rotate(${SECOND_DEG}deg)` }}>
              <span className="absolute top-[10%] left-1/2 h-[40%] w-px -translate-x-1/2 bg-gules" />
            </span>
            {/* centre pin + crown nub */}
            <span
              className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-black/40"
              style={{ background: tone.hand }}
            />
            <span className="absolute top-1/2 -right-[7px] h-3 w-1.5 -translate-y-1/2 rounded-[2px] bg-[#8e8e96]" />
          </span>
          <span aria-hidden className="h-8 w-12 rounded-b-md" style={{ background: strapBg }} />
        </motion.div>
        )}
        {/* tooltip with the watch details: hover on desktop, tap on touch */}
        <div
          className={`pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 w-max max-w-[13rem] -translate-x-1/2 rounded-xl border border-line bg-canvas-raised px-3 py-2 text-left shadow-[var(--shadow-lift)] transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100 ${
            open ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <p className="font-display text-sm font-semibold text-ink">
            {watch.brand} <span className="font-normal text-ink-soft">{watch.model}</span>
            {watch.wishlist && (
              <span className="ml-1.5 align-middle text-[9px] font-semibold tracking-wide text-accent uppercase">
                wishlist
              </span>
            )}
          </p>
          <p className="mt-1 text-xs leading-snug text-ink-soft">{watch.why}</p>
          <span
            aria-hidden
            className="absolute top-full left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-r border-b border-line bg-canvas-raised"
          />
        </div>
      </div>
    </motion.li>
  );
}

/**
 * Watches (brief section 6.7): the collection in a leather travel roll with
 * a stitched frame, a flap edge, and one slot per watch. Everything here is
 * an honest placeholder until the real roll is shot.
 */
/** Horizontal centre of each velvet slot, as a fraction of the roll asset. */
const SLOT_X = ["19%", "48%", "78%"];

export function Watches() {
  // AI leather roll photo (AI-ASSET-PROMPTS.md C4). Transparent PNG: it sits
  // directly on the section, no card or crop, with the watches resting in the
  // three velvet slots and captions hanging on the leather below.
  const rollSrc = aiAsset("artifacts/watch-roll");
  return (
    <Section
      id="watches"
      title="The watch roll"
      aside="the rotation, such as it is"
    >
      <Reveal>
        {rollSrc ? (
          <div className="relative mx-auto w-full max-w-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={rollSrc}
              alt=""
              loading="lazy"
              className="pointer-events-none block w-full select-none"
            />
            <ol className="absolute inset-0">
              {WATCHES.map((watch, i) => (
                <WatchPiece key={watch.id} watch={watch} slotX={SLOT_X[i]} index={i} />
              ))}
            </ol>
            {/* Sipho designed the Opulens Spirit Blue in the centre slot.
                Shown on every width; smaller on mobile so it fits the flap. */}
            <div className="pointer-events-none absolute top-[15%] left-[48%] flex -translate-x-1/2 flex-col items-center sm:top-[19%]">
              <p className="-rotate-2 font-hand text-[11px] text-[#f3e8cf] [text-shadow:0_1px_3px_rgb(20_20_22/0.6)] sm:text-xl">
                I designed this one
              </p>
              <svg viewBox="0 0 44 48" className="mt-0.5 h-6 w-5 text-[#f3e8cf] sm:h-9 sm:w-8" fill="none" aria-hidden>
                <path d="M24 4 C 33 17, 11 25, 20 40" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M12 33 L20 41 L29 35" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        ) : (
          // CSS-fallback roll (stitched leather) while the photo is absent.
          <div
            className="relative rounded-2xl shadow-(--shadow-lift)"
            style={{
              background:
                "linear-gradient(140deg, #7d4e2c 0%, #5f3a1f 45%, #4a2c16 100%)",
            }}
          >
            {/* flap edge with its own stitch line */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-9 rounded-t-2xl border-b border-dashed border-[#e8c493]/40"
              style={{ background: "linear-gradient(180deg, #8a5732, #6f4525)" }}
            />
            {/* tie strap crossing the flap */}
            <span
              aria-hidden
              className="absolute -top-1 right-10 h-14 w-4 rotate-1 rounded-full shadow-md"
              style={{ background: "linear-gradient(90deg, #3c2413, #59371f)" }}
            />
            {/* stitched dashed frame */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-2.5 rounded-xl border-2 border-dashed border-[#e8c493]/35"
            />
            <ol className="relative grid gap-8 px-6 pt-16 pb-8 sm:grid-cols-3 sm:gap-6 sm:px-8 sm:pt-7 sm:pb-6">
              {WATCHES.map((watch) => (
                <WatchPiece key={watch.id} watch={watch} />
              ))}
            </ol>
          </div>
        )}
      </Reveal>
    </Section>
  );
}
