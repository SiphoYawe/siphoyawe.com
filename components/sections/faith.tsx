import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Handwritten } from "@/components/ui/handwritten";
import { PillButton } from "@/components/ui/pill-button";
import { FAITH } from "@/data/faith";
import { READY_SCRIBE_URL } from "@/data/socials";

/**
 * Faith (brief section 6.14): short, honest, quiet. A narrow centred column
 * with an illuminated drop cap, verse marginalia in the side margin, and one
 * pill out to Ready Scribe. No motion beyond the standard Reveal.
 */
export function Faith() {
  const firstLetter = FAITH.blurb.charAt(0);
  const rest = FAITH.blurb.slice(1);

  const marginalia = (
    <>
      {FAITH.marginalia.verse}
      <span className="mt-1 block text-base">{FAITH.marginalia.reference}</span>
    </>
  );

  return (
    <Section id="faith" title="Coram Deo">
      <Reveal>
        <div className="relative mx-auto max-w-2xl">
          {/* Verse marginalia, tucked in the side margin on desktop */}
          <aside className="absolute top-4 -right-56 hidden w-44 lg:block xl:-right-64">
            <Handwritten rotate={3}>{marginalia}</Handwritten>
          </aside>

          <p className="text-lg leading-relaxed">
            <span
              aria-hidden="true"
              className="float-left mt-1.5 mr-3 font-heraldic text-6xl leading-[0.75] text-or sm:text-7xl"
            >
              {firstLetter}
            </span>
            <span className="sr-only">{firstLetter}</span>
            {rest}
          </p>

          {/* Same note, flowing below the text on smaller screens */}
          <aside className="mt-8 lg:hidden">
            <Handwritten rotate={-1.5}>{marginalia}</Handwritten>
          </aside>

          <p className="mt-8 leading-relaxed text-ink-soft">{FAITH.readyScribeNote}</p>

          <div className="mt-6">
            <PillButton label="Read Ready Scribe" href={READY_SCRIBE_URL} external badge="or" />
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
