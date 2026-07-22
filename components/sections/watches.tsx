"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { springs } from "@/lib/motion";
import { WATCHES, type Watch } from "@/data/watches";
import { aiAsset } from "@/lib/ai-assets";

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

/** Per-slot vertical seat, so each dial lines up in its velvet cushion. The
 * Opulens image carries more strap below the dial, so it seats a touch lower. */
const SLOT_TOP = ["30%", "34%", "30%"];

/**
 * One watch resting in its slot: strap arcs above and below a toned dial
 * with simple hands and a crown nub. Micro-interaction (brief section 6.7):
 * lifts and rotates slightly out of the slot on hover, bouncy spring.
 */
function WatchPiece({ watch, slotX, index = 0 }: { watch: Watch; slotX?: string; index?: number }) {
  const reduce = useReducedMotion();
  const [imgError, setImgError] = useState(false);
  const tone = TONES[watch.tone];
  const strapBg = `linear-gradient(90deg, rgb(0 0 0 / 0.35), transparent 30%, rgb(255 255 255 / 0.12) 50%, transparent 70%, rgb(0 0 0 / 0.35)), ${tone.strap}`;
  const showImg = Boolean(watch.image) && !imgError;

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ ...springs.soft, delay: 0.15 + index * 0.13 }}
      className={
        slotX
          ? "absolute flex w-[32%] -translate-x-1/2 flex-col items-center text-center"
          : "flex flex-col items-center text-center"
      }
      style={slotX ? { left: slotX, top: SLOT_TOP[index] ?? "30%" } : undefined}
    >
      {/* the watch seated in its slot on the leather */}
      <div className="relative flex h-44 w-full items-center justify-center sm:h-48">
        {/* soft contact shadow on the leather */}
        <span
          aria-hidden
          className="absolute bottom-4 h-3.5 w-24 rounded-[50%] bg-black/45 blur-md"
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
              className="h-40 w-auto object-contain drop-shadow-[0_10px_14px_rgb(0_0_0/0.5)] sm:h-44"
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
      </div>

      {/* caption on the leather, cream ink so both themes read */}
      <p className="mt-3 font-display text-sm font-semibold text-[#f6efe1] [text-shadow:0_1px_2px_rgb(20_20_22/0.4)]">
        {watch.brand}
        {watch.wishlist && (
          <span className="ml-1.5 align-middle text-[10px] font-normal tracking-wide text-[#d8c9ae] uppercase">
            wishlist
          </span>
        )}
      </p>
      <p className="mt-0.5 text-xs text-[#d8c9ae] [text-shadow:0_1px_2px_rgb(20_20_22/0.4)]">{watch.model}</p>
      <p className="mt-1.5 max-w-52 -rotate-1 font-hand text-lg leading-tight text-[#efe3c8] [text-shadow:0_1px_2px_rgb(20_20_22/0.45)] sm:line-clamp-2">
        {watch.why}
      </p>
    </motion.li>
  );
}

/**
 * Watches (brief section 6.7): the collection in a leather travel roll with
 * a stitched frame, a flap edge, and one slot per watch. Everything here is
 * an honest placeholder until the real roll is shot.
 */
/** Horizontal centre of each velvet slot, as a fraction of the roll asset. */
const SLOT_X = ["19%", "45%", "75.5%"];

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
