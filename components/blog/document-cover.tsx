/**
 * A stylized document preview: the front page on top, two sheets peeking out
 * behind it, a soft drop shadow for lift, and the whole stack fading to nothing
 * about halfway down, so it reads as a paper document that carries on past the
 * frame. Purely decorative.
 */
export function DocumentCover({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none relative w-64 select-none sm:w-80 ${className}`}
      style={{ filter: "drop-shadow(0 16px 26px rgb(0 0 0 / 0.22))" }}
    >
      <div className="relative">
        {/* two sheets stacked behind the cover, peeking at the edges. Told
        apart from the page behind them by their own shadow and edge, the way
        real paper is, not by colour. */}
        <div className="absolute inset-0 translate-x-[14px] translate-y-[10px] rotate-[4deg] rounded-[4px] bg-[#faf8f2] shadow-[0_6px_16px_rgb(0_0_0/0.16)] ring-1 ring-black/10" />
        <div className="absolute inset-0 -translate-x-[10px] translate-y-[6px] -rotate-[3deg] rounded-[4px] bg-[#fdfcf8] shadow-[0_4px_12px_rgb(0_0_0/0.14)] ring-1 ring-black/10" />
        {/* the front page */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          loading="lazy"
          className="relative block w-full rounded-[4px] bg-white ring-1 ring-black/10"
        />
        {/* the whole stack fades to nothing about halfway down: an overlay
        blending into the page background, not a CSS mask (unreliable across
        browsers for this gradient), overshooting the box a little so the
        rotated sheets' peeking corners fade too, not just the front page. */}
        <div className="pointer-events-none absolute -inset-x-3 top-[44%] -bottom-6 bg-gradient-to-b from-transparent to-canvas" />
      </div>
    </div>
  );
}
