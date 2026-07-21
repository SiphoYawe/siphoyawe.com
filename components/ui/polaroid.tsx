"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { springs } from "@/lib/motion";
import { TapeStrip } from "./doodles";

type PolaroidProps = {
  /** Image src (placeholder ok) and accessible alt. */
  src: string;
  alt: string;
  /** Handwritten caption under the photo. */
  caption?: string;
  /** Green-dot status pill (Portfolix "Available for new projects"). */
  status?: string;
  rotate?: number;
  tape?: boolean;
  className?: string;
};

/**
 * White polaroid frame: thick bottom band, soft shadow, handwritten caption.
 * Micro-interaction: tilts a touch straighter and lifts on hover (spring).
 */
export function Polaroid({
  src,
  alt,
  caption,
  status,
  rotate = -3,
  tape = false,
  className = "",
}: PolaroidProps) {
  const reduce = useReducedMotion();

  return (
    <motion.figure
      initial={reduce ? false : { opacity: 0, y: 24, rotate: rotate * 2 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, rotate }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover={reduce ? undefined : { rotate: rotate / 3, y: -6, scale: 1.02 }}
      transition={springs.soft}
      className={`relative inline-block bg-white p-3 pb-4 shadow-(--shadow-polaroid) dark:bg-[#efede8] ${className}`}
    >
      {tape && (
        <TapeStrip className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 -rotate-3" />
      )}
      <div className="relative block aspect-square w-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 80vw, 320px"
          className="object-cover"
        />
      </div>
      <figcaption className="flex min-h-10 items-center justify-between gap-3 px-1 pt-3">
        {caption ? (
          <span className="font-hand text-xl leading-none text-[#3c3a36]">{caption}</span>
        ) : (
          <span />
        )}
        {status && (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#eafbef] px-2.5 py-1 text-[11px] font-semibold text-[#157a34] ring-1 ring-[#157a34]/20">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#22c55e] opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-[#22c55e]" />
            </span>
            {status}
          </span>
        )}
      </figcaption>
    </motion.figure>
  );
}
