import { Reveal } from "./reveal";
import { SectionTracker } from "./section-tracker";

type SectionProps = {
  id?: string;
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
 * quiet reveal. Titles are Satoshi; a handwritten aside sits alongside.
 */
export function Section({
  id,
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
      {id && <SectionTracker id={id} />}
      {(title || aside) && (
        <Reveal className="mb-10 sm:mb-14">
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
