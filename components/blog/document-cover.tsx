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
      className={`pointer-events-none relative w-48 select-none sm:w-56 ${className}`}
      style={{ filter: "drop-shadow(0 16px 26px rgb(0 0 0 / 0.22))" }}
    >
      <div
        style={{
          maskImage: "linear-gradient(to bottom, #000 46%, transparent 90%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 46%, transparent 90%)",
        }}
      >
        {/* two sheets stacked behind the cover, peeking at the edges */}
        <div className="absolute inset-0 translate-x-[10px] translate-y-[8px] rotate-[3.5deg] rounded-[4px] bg-[#e7e3d8] ring-1 ring-black/[0.06]" />
        <div className="absolute inset-0 -translate-x-[7px] translate-y-[4px] -rotate-[2.5deg] rounded-[4px] bg-[#f2efe7] ring-1 ring-black/[0.06]" />
        {/* the front page */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          loading="lazy"
          className="relative block w-full rounded-[4px] bg-white ring-1 ring-black/10"
        />
      </div>
    </div>
  );
}
