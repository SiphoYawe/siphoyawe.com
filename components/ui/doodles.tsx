/**
 * Hand-drawn doodle SVGs (danielsun motif). Deliberately imperfect strokes —
 * drawn once, reused everywhere. All presentational.
 */

export function BurstStrokes({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden
      className={className}
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
    >
      <path d="M14 62 C 26 52, 30 40, 28 26" />
      <path d="M40 78 C 52 66, 58 50, 56 34" />
      <path d="M70 88 C 82 76, 88 60, 88 42" />
      <path d="M96 92 C 104 82, 108 70, 108 56" />
    </svg>
  );
}

/** Hand-drawn squiggle underline — the active-nav and accent underline. */
export function SquiggleUnderline({
  className = "",
  gradient = false,
}: {
  className?: string;
  /** Yellow-to-Azure stroke (active nav link, brief section 7). */
  gradient?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 12"
      fill="none"
      aria-hidden
      preserveAspectRatio="none"
      className={className}
      stroke={gradient ? "url(#squiggle-grad)" : "currentColor"}
      strokeWidth="3.5"
      strokeLinecap="round"
    >
      {gradient && (
        <defs>
          <linearGradient id="squiggle-grad" x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FCDD09" />
            <stop offset="1" stopColor="#2B5DF2" />
          </linearGradient>
        </defs>
      )}
      <path d="M2 8 C 14 2, 22 11, 34 6 S 50 2, 62 7 S 82 11, 94 6 S 110 3, 118 7" />
    </svg>
  );
}

/** Loose hand-drawn arrow, for captions pointing at things. */
export function DoodleArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 60"
      fill="none"
      aria-hidden
      className={className}
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 6 C 30 14, 56 24, 66 46" />
      <path d="M54 44 L 67 48 L 70 34" />
    </svg>
  );
}

/** Washi-tape strip for polaroids and pinned cards. */
export function TapeStrip({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`h-6 w-20 bg-or/70 shadow-sm backdrop-blur-[1px] dark:bg-or/50 ${className}`}
      style={{
        clipPath:
          "polygon(2% 8%, 98% 0%, 100% 88%, 96% 100%, 3% 96%, 0% 84%)",
      }}
    />
  );
}
