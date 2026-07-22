"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { springs } from "@/lib/motion";
import { aiAsset } from "@/lib/ai-assets";
import { Crane } from "@/components/crane/crane-mascot";
import { STAMPS, type Stamp } from "@/data/stamps";

const INK: Record<Stamp["ink"], string> = {
  azure: "#2B5DF2",
  gules: "#D50000",
  sable: "#141416",
};

/** AI stamp slots (AI-ASSET-PROMPTS.md section G), keyed on the stamp id. All
 * six countries carry a generated ink imprint; the CSS stamp is the fallback. */
const STAMP_AI: Record<string, string> = {
  uganda: "stamps/stamp-kampala",
  uk: "stamps/stamp-london",
  usa: "stamps/stamp-usa",
  dubai: "stamps/stamp-dubai",
  "south-africa": "stamps/stamp-south-africa",
  kenya: "stamps/stamp-kenya",
};

/** Turns the full-colour crest into a gold foil imprint (brief 6.12). */
const GOLD_FOIL =
  "sepia(1) saturate(3.4) hue-rotate(-6deg) brightness(1.04) contrast(0.9)";

/** Cream passport paper, darkened at the spine side, lighter curl at the outer edge. */
const LEFT_PAGE =
  "linear-gradient(100deg, #e9e1cc 0%, #F7F5F0 16%, #F7F5F0 82%, #e4dbc2 100%)";
const RIGHT_PAGE =
  "linear-gradient(260deg, #e9e1cc 0%, #F7F5F0 16%, #F7F5F0 82%, #e4dbc2 100%)";

/**
 * One ink imprint: ~3px border in the stamp's ink, dashed inner ring, heraldic
 * place, hand-written caption, mix-blend-multiply so the ink sits into the
 * paper. Micro-interaction: presses in on hover, ink deepens (brief 6.12).
 */
function InkStamp({ stamp, index }: { stamp: Stamp; index: number }) {
  const reduce = useReducedMotion();
  const ink = INK[stamp.ink];
  const circle = index % 2 === 1;
  const slot = STAMP_AI[stamp.id];
  const aiSrc = slot ? aiAsset(slot) : null;

  return (
    <motion.div
      whileHover={reduce ? undefined : { scale: 0.95, opacity: 1 }}
      transition={springs.bouncy}
      style={{ rotate: stamp.rotate }}
      className="opacity-75 mix-blend-multiply"
    >
      {aiSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={aiSrc} alt="" loading="lazy" className="size-24 object-contain sm:size-28" />
      ) : (
      <div
        className={`grid size-24 place-items-center border-[3px] p-1 sm:size-28 ${
          circle ? "rounded-full" : "rounded-lg"
        }`}
        style={{ borderColor: ink, color: ink }}
      >
        <div
          className={`grid h-full w-full place-items-center border border-dashed px-1.5 py-2 text-center ${
            circle ? "rounded-full" : "rounded-md"
          }`}
          style={{ borderColor: ink }}
        >
          <div>
            <p className="font-heraldic text-[9px] tracking-[0.12em] uppercase sm:text-[10px]">
              {stamp.place}
            </p>
            <p className="mt-0.5 font-hand text-sm leading-tight sm:text-base">
              {stamp.caption}
            </p>
            <p className="mt-0.5 text-[8px] tracking-[0.2em] uppercase sm:text-[9px]">
              {stamp.date}
            </p>
          </div>
        </div>
      </div>
      )}
    </motion.div>
  );
}

/** The Yawe wax seal: round gold blob with an SY monogram. Same press on hover. */
function WaxSeal() {
  const reduce = useReducedMotion();
  // AI seal stamp (AI-ASSET-PROMPTS.md G4) replaces the CSS blob when it lands.
  const aiSrc = aiAsset("stamps/stamp-yawe-seal");

  return (
    <motion.div
      whileHover={reduce ? undefined : { scale: 0.95 }}
      transition={springs.bouncy}
      style={{ rotate: -12 }}
      className="grid size-24 place-items-center sm:size-28"
      role="img"
      aria-label="The Yawe wax seal, gold, with an SY monogram"
    >
      {aiSrc ? (
        <span className="relative grid size-full place-items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={aiSrc} alt="" loading="lazy" className="absolute inset-0 size-full object-contain" />
          {/* the family crest pressed into the oval as a gold-ink mark */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/crest-badge.svg"
            alt=""
            className="relative w-[42%] opacity-80 mix-blend-multiply"
            style={{ filter: GOLD_FOIL }}
          />
        </span>
      ) : (
      <div
        className="grid size-full place-items-center"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #ffe764 0%, #FCDD09 42%, #e3bc06 75%, #b8940a 100%)",
          borderRadius: "47% 53% 50% 50% / 49% 46% 54% 51%",
          boxShadow:
            "0 4px 10px rgb(0 0 0 / 0.3), inset 0 -5px 9px rgb(0 0 0 / 0.22), inset 0 2px 4px rgb(255 255 255 / 0.55)",
        }}
      >
        <div
          className="grid size-[72%] place-items-center"
          style={{
            borderRadius: "50% 48% 52% 49% / 51% 52% 48% 50%",
            border: "1.5px solid rgb(120 90 0 / 0.45)",
            boxShadow: "inset 0 1px 3px rgb(0 0 0 / 0.25)",
          }}
        >
          <span
            className="font-heraldic text-lg font-bold tracking-[0.12em] sm:text-xl"
            style={{ color: "#6b5200" }}
          >
            SY
          </span>
        </div>
      </div>
      )}
    </motion.div>
  );
}

/**
 * Passport and travel stamps (brief section 6.12): an open passport spread,
 * gold-foil crest on the left page, and ink stamps plus the wax seal on the
 * right.
 */
export function Passport() {
  // AI open-passport spread (AI-ASSET-PROMPTS.md C9) replaces the CSS page
  // gradients when the final lands; crest, text and stamps stay in code.
  const spreadSrc = aiAsset("artifacts/passport-spread");
  // The closed Ugandan passport, tucked behind the open spread as the lead
  // object — the book these stamps came out of (AI-ASSET-PROMPTS.md C).
  const coverSrc = aiAsset("artifacts/passport-cover");

  return (
    <Section
      id="passport"
      title="Kampala to the UK"
      aside="stamps so far"
    >
      <Reveal className="mx-auto max-w-3xl">
       <div className="relative">
        {/* closed passport cover, peeking out behind the open spread */}
        {coverSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverSrc}
            alt="A closed Ugandan passport"
            loading="lazy"
            className="pointer-events-none absolute -top-12 -left-24 z-0 hidden w-44 -rotate-[9deg] select-none drop-shadow-[0_16px_30px_rgb(0_0_0/0.35)] lg:block xl:-left-36 xl:w-52"
          />
        )}
        {/* a crowned crane flying the Kampala-to-UK route, over the spread */}
        <Crane
          pose="flying"
          phase={1.1}
          className="absolute -top-12 right-6 z-20 hidden w-24 sm:block xl:right-0"
        />
        <div className="relative z-10 -rotate-[0.6deg] rounded-[1.6rem] bg-night p-2.5 pb-4 shadow-(--shadow-lift) sm:p-3 sm:pb-5">
          <div className={`grid overflow-hidden rounded-[1.1rem] sm:grid-cols-2 ${spreadSrc ? "relative" : ""}`}>
            {spreadSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={spreadSrc}
                alt=""
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
              />
            )}
            {/* left page: the crest in gold foil */}
            <div
              className="relative flex flex-col items-center justify-center gap-5 px-6 py-12"
              style={{ background: spreadSrc ? "transparent" : LEFT_PAGE }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/crest-badge.svg"
                alt="Yawe family crest, embossed as a gold foil stamp"
                className="w-24 opacity-50 mix-blend-multiply sm:w-28"
                style={{ filter: GOLD_FOIL }}
              />
              <div className="text-center">
                <p className="font-heraldic text-base tracking-[0.45em] text-[#8a6d03] sm:text-lg">
                  PASSPORT
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/signature-black.png"
                  alt="Sipho Yawe signature"
                  className="mx-auto mt-3 h-9 w-auto opacity-90 mix-blend-multiply"
                />
              </div>
            </div>

            {/* right page: travel stamps plus the wax seal */}
            <div
              className={`px-5 py-8 sm:py-10 ${spreadSrc ? "relative" : ""}`}
              style={{ background: spreadSrc ? "transparent" : RIGHT_PAGE }}
            >
              <div className="grid grid-cols-2 justify-items-center gap-3 sm:gap-4">
                {STAMPS.map((stamp, i) => (
                  <InkStamp key={stamp.id} stamp={stamp} index={i} />
                ))}
                <div className="col-span-2 mt-1 flex justify-center">
                  <WaxSeal />
                </div>
              </div>
            </div>
          </div>

          {/* centre spine shadow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-3 left-1/2 hidden w-16 -translate-x-1/2 sm:block"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgb(20 16 4 / 0.28) 50%, transparent 100%)",
            }}
          />
        </div>
       </div>
      </Reveal>
    </Section>
  );
}
