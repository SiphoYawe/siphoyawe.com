"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { TiltedCard } from "@/components/ui/tilted-card";
import { TagChip } from "@/components/ui/tag-chip";
import { PillButton } from "@/components/ui/pill-button";
import { Reveal } from "@/components/ui/reveal";
import { springs, staggerContainer, staggerPop } from "@/lib/motion";
import { useIsMobile } from "@/lib/use-is-mobile";
import { PROJECTS, type Project } from "@/data/projects";

const SHOT_PLACEHOLDER = (name: string, hue: string) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400"><rect width="640" height="400" fill="${hue}"/><rect x="26" y="26" width="588" height="348" rx="18" fill="none" stroke="#F7F5F0" stroke-opacity="0.4" stroke-width="2.5" stroke-dasharray="2 11" stroke-linecap="round"/><text x="320" y="242" font-family="sans-serif" font-size="168" font-weight="700" fill="#F7F5F0" fill-opacity="0.22" text-anchor="middle">${name[0]}</text><text x="320" y="330" font-family="sans-serif" font-size="16" font-weight="600" letter-spacing="4.5" fill="#F7F5F0" fill-opacity="0.9" text-anchor="middle">SCREENSHOT COMING SOON</text></svg>`,
  );

const CARD_HUES: Record<string, string> = {
  chariot: "#2B5DF2",
  mina: "#0e8a72",
  zion: "#5b21b6",
  spica: "#b4460a",
  cardpass: "#a4134f",
};

/** Tiny gold star sticker hidden inside some cards (easter egg). */
function HiddenSticker() {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      whileHover={reduce ? undefined : { rotate: 72, scale: 1.25 }}
      transition={springs.bouncy}
      className="absolute right-4 bottom-4 z-10 grid size-9 cursor-help place-items-center rounded-full bg-or shadow-md"
      title="you found a sticker"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="#141416">
        <path d="M12 2l2.6 6.2 6.7.5-5.1 4.4 1.6 6.5L12 16l-5.8 3.6 1.6-6.5-5.1-4.4 6.7-.5z" />
      </svg>
    </motion.span>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  // On phones the cards sit straight and centred; the paper tilt and side
  // stagger are desktop-only flourishes.
  const tilt = isMobile ? 0 : index % 2 === 0 ? -1.6 : 1.8;
  return (
    <Reveal
      variant={isMobile ? "up" : index % 2 === 0 ? "left" : "right"}
      delay={(index % 2) * 0.1}
      className={index % 2 === 1 ? "sm:mt-14" : ""}
    >
      <TiltedCard rotate={tilt} className="group">
        {project.hiddenSticker && <HiddenSticker />}
        <div className="p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image ?? SHOT_PLACEHOLDER(project.name, CARD_HUES[project.id] ?? "#2B5DF2")}
            alt={project.image ? `${project.name} project screenshot` : ""}
            className="w-full rounded-xl"
            loading="lazy"
          />
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display text-2xl font-semibold tracking-tight">
              {project.name}
              <span className="ml-2 font-sans text-sm font-normal text-ink-soft">{project.year}</span>
            </h3>
          </div>
          <p className="mt-2 leading-relaxed text-ink-soft">{project.oneLiner}</p>
          <motion.div
            variants={staggerContainer}
            initial={reduce ? false : "hidden"}
            whileInView={reduce ? undefined : "visible"}
            viewport={{ once: true, margin: "-40px" }}
            className="mt-4 flex flex-wrap items-center gap-2"
          >
            {project.tags.map((tag) => (
              <motion.span key={tag.label} variants={staggerPop} className="inline-flex">
                <TagChip label={tag.label} color={tag.color} rotate={0} className="!px-2.5 !py-1 text-xs" />
              </motion.span>
            ))}
          </motion.div>
          <div className="mt-5 flex flex-wrap gap-3">
            {project.links.live && <PillButton label="Visit" href={project.links.live} external badge="azure" />}
            {project.links.github && <PillButton label="Code" href={project.links.github} external badge="or" />}
          </div>
        </div>
      </TiltedCard>
    </Reveal>
  );
}

/**
 * Projects Built (brief section 6.3): large tilted cards with screenshots,
 * chips, and the black pill with arrow badge. Hidden stickers in some.
 */
export function Projects() {
  return (
    <Section id="projects" title="Things I've built" aside="each one shipped">
      <div className="grid gap-10 sm:grid-cols-2">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </Section>
  );
}
