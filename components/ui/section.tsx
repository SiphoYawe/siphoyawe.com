import { Reveal } from "./reveal";

type SectionProps = {
  id?: string;
  /** Heraldic kicker word above the title (often the translated kicker). */
  kicker?: string;
  title?: string;
  /** Optional handwritten aside next to the title (danielsun annotation). */
  aside?: string;
  children: React.ReactNode;
  className?: string;
  /** Bleed to full width (hero). Default constrains to the reading column. */
  bleed?: boolean;
};

/**
 * The room's walls: every scroll section shares rhythm, anchor id, and a
 * quiet reveal. Titles are Clash Display; kickers are Cinzel caps (heraldic).
 */
export function Section({
  id,
  kicker,
  title,
  aside,
  children,
  className = "",
  bleed = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 ${
        bleed ? "" : "mx-auto max-w-5xl"
      } ${className}`}
    >
      {(kicker || title) && (
        <Reveal className="mb-10 sm:mb-14">
          {kicker && (
            <p className="mb-3 font-heraldic text-xs tracking-[0.3em] text-accent uppercase">
              {kicker}
            </p>
          )}
          <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
            {title && (
              <h2 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                {title}
              </h2>
            )}
            {aside && (
              <p className="-rotate-2 pb-1 font-hand text-xl text-ink-soft sm:text-2xl">
                {aside}
              </p>
            )}
          </div>
        </Reveal>
      )}
      {children}
    </section>
  );
}
