/**
 * A stylized document preview: the front page on top, two sheets peeking out
 * behind it, and the whole stack faded to nothing at the bottom, so it reads
 * as a paper document that carries on past the frame. Purely decorative.
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
      className={`pointer-events-none relative w-40 shrink-0 select-none sm:w-48 ${className}`}
      style={{
        maskImage: "linear-gradient(to bottom, #000 58%, transparent 96%)",
        WebkitMaskImage: "linear-gradient(to bottom, #000 58%, transparent 96%)",
      }}
    >
      {/* two sheets stacked behind the cover, peeking at the edges */}
      <div className="absolute inset-0 translate-x-[7px] translate-y-[6px] rotate-[3deg] rounded-[3px] bg-[#eeeae0] shadow-[0_12px_26px_rgb(0_0_0/0.14)] ring-1 ring-black/5" />
      <div className="absolute inset-0 -translate-x-[5px] translate-y-[3px] -rotate-[2deg] rounded-[3px] bg-[#f5f2ea] shadow-[0_12px_26px_rgb(0_0_0/0.12)] ring-1 ring-black/5" />
      {/* the front page */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        className="relative block w-full rounded-[3px] bg-white shadow-[0_18px_40px_rgb(0_0_0/0.24)] ring-1 ring-black/10"
      />
    </div>
  );
}
