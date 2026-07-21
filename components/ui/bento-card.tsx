type BentoCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Span helper for bento grids. */
  span?: 1 | 2;
};

/**
 * Soft bento story card (danielsun): quiet surface, gentle border, room for
 * doodles and handwritten notes. No hover theatrics — the budget is spent
 * elsewhere.
 */
export function BentoCard({ children, className = "", span = 1 }: BentoCardProps) {
  return (
    <div
      className={`rounded-3xl border border-line bg-canvas-raised p-6 shadow-sm sm:p-8 ${
        span === 2 ? "sm:col-span-2" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
