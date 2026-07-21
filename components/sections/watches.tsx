"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Kicker } from "@/components/ui/kicker";
import { Reveal } from "@/components/ui/reveal";
import { springs } from "@/lib/motion";
import { WATCHES, type Watch } from "@/data/watches";

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
function WatchPiece({ watch }: { watch: Watch }) {
  const reduce = useReducedMotion();
  const tone = TONES[watch.tone];
  const strapBg = `linear-gradient(90deg, rgb(0 0 0 / 0.35), transparent 30%, rgb(255 255 255 / 0.12) 50%, transparent 70%, rgb(0 0 0 / 0.35)), ${tone.strap}`;

  return (
    <li className="flex flex-col items-center text-center">
      {/* recessed slot in the leather */}
      <div className="w-full rounded-2xl bg-black/25 px-4 py-6 shadow-[inset_0_3px_10px_rgb(0_0_0/0.5)] ring-1 ring-white/10">
        <motion.div
          whileHover={reduce ? undefined : { y: -8, rotate: 2 }}
          transition={springs.bouncy}
          className="flex cursor-default flex-col items-center"
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
      </div>

      {/* caption on the leather, cream ink so both themes read */}
      <p className="mt-4 font-display text-sm font-semibold text-[#f6efe1]">{watch.brand}</p>
      <p className="mt-0.5 text-xs text-[#d8c9ae]">{watch.model}</p>
      <p className="mt-2 max-w-52 -rotate-1 font-hand text-lg leading-tight text-[#efe3c8]">
        {watch.why}
      </p>
    </li>
  );
}

/**
 * Watches (brief section 6.7): the collection in a leather travel roll with
 * a stitched frame, a flap edge, and one slot per watch. Everything here is
 * an honest placeholder until the real roll is shot.
 */
export function Watches() {
  return (
    <Section
      id="watches"
      kicker={<Kicker k="watches" />}
      title="The watch roll"
      aside="placeholders until the real roll is shot"
    >
      <Reveal>
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

          <ol className="relative grid gap-8 px-6 pt-16 pb-8 sm:grid-cols-3 sm:gap-6 sm:px-8">
            {WATCHES.map((watch) => (
              <WatchPiece key={watch.id} watch={watch} />
            ))}
          </ol>
        </div>
      </Reveal>
    </Section>
  );
}
