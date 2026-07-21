"use client";

import { Section } from "@/components/ui/section";
import { Kicker } from "@/components/ui/kicker";
import { TiltedCard } from "@/components/ui/tilted-card";
import { Reveal } from "@/components/ui/reveal";
import { Handwritten } from "@/components/ui/handwritten";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import { TESTIMONIALS, type Testimonial } from "@/data/testimonials";

const TOP_CYCLE = ["azure", "or", "gules"] as const;
const TILTS = [-2.2, 1.4, -1.2];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Small arrow out to the quote's source, where one exists (tracked). */
function SourceLink({ href, name, id }: { href: string; name: string; id: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Source for the quote from ${name} (opens in a new tab)`}
      onClick={() =>
        trackEvent(AnalyticsEvents.OutboundClick, { target: href, cta: `testimonial:${id}` })
      }
      className="ml-auto grid size-8 shrink-0 place-items-center rounded-full border border-line text-ink-soft hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M7 17 L17 7 M9 7 h8 v8" />
      </svg>
    </a>
  );
}

/**
 * One quote card. The micro-interaction is exactly what TiltedCard already
 * does (squares up slightly, shadow deepens); nothing extra is added here.
 */
function QuoteCard({ item, index }: { item: Testimonial; index: number }) {
  return (
    <TiltedCard
      rotate={TILTS[index % TILTS.length]}
      topColor={TOP_CYCLE[index % TOP_CYCLE.length]}
      className="flex h-full flex-col"
    >
      <figure className="flex h-full flex-col p-6">
        <span aria-hidden className="font-heraldic text-6xl leading-[0.5] text-accent/30">
          &ldquo;
        </span>
        <blockquote className="mt-5 flex-1">
          <p className="leading-relaxed">{item.quote}</p>
        </blockquote>
        <figcaption className="mt-6 flex items-center gap-3">
          <span
            aria-hidden
            className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-canvas font-heraldic text-sm text-ink-soft"
          >
            {initials(item.name)}
          </span>
          <span className="min-w-0">
            <span className="block font-display text-sm font-semibold">{item.name}</span>
            <span className="block text-xs text-ink-soft">{item.role}</span>
          </span>
          {item.href && <SourceLink href={item.href} name={item.name} id={item.id} />}
        </figcaption>
      </figure>
    </TiltedCard>
  );
}

/**
 * Testimonials (brief section 6.15): tilted quote cards with a heraldic quote
 * mark and an initials placeholder for the photo. All entries are deliberate
 * placeholders from the data file, rendered as-is.
 */
export function Testimonials() {
  return (
    <Section
      id="testimonials"
      kicker={<Kicker k="testimonials" />}
      title="Kind words"
      aside="real ones land here soon"
    >
      <div className="grid gap-8 md:grid-cols-3">
        {TESTIMONIALS.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.07} className="h-full">
            <QuoteCard item={item} index={i} />
          </Reveal>
        ))}
      </div>
      <Handwritten className="mt-10 text-center" rotate={-1.4}>
        these are placeholders until the real quotes arrive
      </Handwritten>
    </Section>
  );
}
