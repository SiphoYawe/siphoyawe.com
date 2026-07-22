import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { BentoCard } from "@/components/ui/bento-card";
import { TagChip } from "@/components/ui/tag-chip";
import { Polaroid } from "@/components/ui/polaroid";
import { TiltedCard } from "@/components/ui/tilted-card";
import { PillButton } from "@/components/ui/pill-button";
import { ConnectButton } from "@/components/ui/connect-button";
import { Handwritten } from "@/components/ui/handwritten";
import { BurstStrokes, DoodleArrow, SquiggleUnderline, TapeStrip } from "@/components/ui/doodles";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false },
};

const PLACEHOLDER_IMG =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#2B5DF2"/><circle cx="200" cy="160" r="70" fill="#F7F5F0"/><ellipse cx="200" cy="330" rx="120" ry="90" fill="#F7F5F0"/><text x="200" y="385" font-family="sans-serif" font-size="18" fill="#FCDD09" text-anchor="middle">photo placeholder</text></svg>`,
  );

function Swatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className={`h-16 w-full rounded-xl border border-line ${className}`} />
      <p className="font-mono text-xs text-ink-soft">{name}</p>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <main className="pt-28 pb-16">
      <Section title="The Yawe room's toolkit" aside="every piece, one micro-interaction">
        <div className="grid gap-6 sm:grid-cols-2">
          <BentoCard>
            <h3 className="mb-4 font-display text-xl font-semibold">Palette</h3>
            <div className="grid grid-cols-3 gap-3">
              <Swatch name="azure #2B5DF2" className="bg-azure" />
              <Swatch name="or #FCDD09" className="bg-or" />
              <Swatch name="gules #D50000" className="bg-gules" />
              <Swatch name="sable #000" className="bg-sable" />
              <Swatch name="steel #848484" className="bg-steel" />
              <Swatch name="paper #F7F5F0" className="bg-paper" />
            </div>
          </BentoCard>

          <BentoCard>
            <h3 className="mb-4 font-display text-xl font-semibold">Type scale</h3>
            <p className="font-display text-5xl font-semibold tracking-tight">Satoshi Bold</p>
            <p className="mt-2 font-display text-2xl font-medium">Satoshi heading</p>
            <p className="mt-2 font-heraldic text-sm tracking-[0.3em] uppercase">Cinzel · Coram Deo</p>
            <p className="mt-2 text-base text-ink-soft">DM Sans body, the quiet workhorse for everything long-form.</p>
            <p className="mt-2 font-hand text-2xl">Caveat — handwritten margin notes</p>
          </BentoCard>
        </div>
      </Section>

      <Section title="Pills and one loud light">
        <div className="grid items-center gap-10 sm:grid-cols-2">
          <BentoCard className="flex flex-wrap items-center gap-4">
            <PillButton label="Let's talk" href="#connect" />
            <PillButton label="Browse projects" href="#projects" badge="or" />
            <Handwritten rotate={-1}>black pill, arrow badge, gules or or</Handwritten>
          </BentoCard>
          <BentoCard className="flex justify-center overflow-visible py-16">
            <ConnectButton />
          </BentoCard>
        </div>
      </Section>

      <Section title="Pastel tag chips" aside="scattered, never aligned">
        <BentoCard className="flex flex-wrap items-center gap-4 py-10">
          <TagChip label="DeFi" color="blue" rotate={-4} />
          <TagChip label="Web3" color="purple" rotate={3} />
          <TagChip label="DevRel" color="pink" rotate={-2} />
          <TagChip label="Builder" color="orange" rotate={5} />
          <TagChip label="Writer" color="mint" rotate={-5} />
        </BentoCard>
      </Section>

      <Section title="Polaroid, tilted paper, bento">
        <div className="grid items-start gap-10 sm:grid-cols-3">
          <Polaroid
            src={PLACEHOLDER_IMG}
            alt="Placeholder portrait of Sipho"
            caption="nze ono (that's me)"
            status="Available to build"
            rotate={-4}
            tape
          />
          <TiltedCard rotate={2} topColor="azure" className="p-6">
            <h4 className="font-display text-lg font-semibold">Tilted paper card</h4>
            <p className="mt-2 text-sm text-ink-soft">
              Rests rotated like dropped paper; squares up and deepens shadow on hover.
              Projects and testimonials live in these.
            </p>
          </TiltedCard>
          <BentoCard>
            <h4 className="font-display text-lg font-semibold">Bento card</h4>
            <p className="mt-2 text-sm text-ink-soft">
              The quiet storyteller. Soft surface, gentle border, doodles welcome.
            </p>
            <DoodleArrow className="mt-3 w-14 -rotate-12 text-or" />
          </BentoCard>
        </div>
      </Section>

      <Section title="Hand-drawn helpers">
        <BentoCard className="flex flex-wrap items-end gap-10">
          <div className="text-center">
            <BurstStrokes className="w-20 text-ink" />
            <p className="mt-2 font-mono text-xs text-ink-soft">burst strokes</p>
          </div>
          <div className="text-center">
            <span className="relative font-display text-xl font-semibold">
              Active link
              <SquiggleUnderline className="absolute -bottom-2 left-0 w-full text-or" />
            </span>
            <p className="mt-4 font-mono text-xs text-ink-soft">squiggle underline</p>
          </div>
          <div className="text-center">
            <DoodleArrow className="w-16 text-ink" />
            <p className="mt-2 font-mono text-xs text-ink-soft">doodle arrow</p>
          </div>
          <div className="relative pt-8 text-center">
            <TapeStrip className="absolute top-0 left-1/2 -translate-x-1/2 -rotate-3" />
            <p className="rounded-lg border border-line bg-canvas px-4 py-3 text-sm">taped thing</p>
            <p className="mt-2 font-mono text-xs text-ink-soft">washi tape</p>
          </div>
        </BentoCard>
      </Section>
    </main>
  );
}
