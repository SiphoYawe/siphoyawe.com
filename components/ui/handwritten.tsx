type HandwrittenProps = {
  children: React.ReactNode;
  className?: string;
  /** Slight hand-placed tilt. */
  rotate?: number;
};

/**
 * Handwritten margin note (verse marginalia, doodle captions). Same motif as
 * the polaroid captions and the journaling-Bible notes.
 */
export function Handwritten({ children, className = "", rotate = -2 }: HandwrittenProps) {
  return (
    <p
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`font-hand text-xl leading-snug text-ink-soft sm:text-2xl ${className}`}
    >
      {children}
    </p>
  );
}
