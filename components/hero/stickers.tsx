/**
 * The hero sticker set (brief section 6.1): crane feather, Ankole cattle,
 * Uganda flag pin, the gold lion, a hidden dove, a "HELLO my name is" tag,
 * a Ledger/Solidity nod, plus coffee and the YHWH crown. Hand-drawn inline
 * SVGs, die-cut style (white rim + soft shadow comes from the wrapper).
 */

export function CraneFeather({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path
        d="M32 54 C 28 40, 26 26, 34 10"
        fill="none"
        stroke="#848484"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M34 10 C 26 14, 20 22, 19 32 C 27 28, 33 20, 34 10 Z" fill="#2B5DF2" />
      <path d="M34 10 C 42 14, 47 22, 48 32 C 40 28, 35 20, 34 10 Z" fill="#5c82ff" />
      <path d="M34 10 C 31 6, 33 3, 36 2 C 38 5, 37 8, 34 10 Z" fill="#FCDD09" />
    </svg>
  );
}

export function HelloTag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 56" className={className} aria-hidden>
      <rect x="2" y="2" width="76" height="52" rx="9" fill="#fff" stroke="#D50000" strokeWidth="2.5" />
      <path d="M2 11 a9 9 0 0 1 9 -9 h58 a9 9 0 0 1 9 9 v9 H2 Z" fill="#D50000" />
      <text x="40" y="16" textAnchor="middle" fill="#fff" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="8.5" letterSpacing="0.5">
        HELLO
      </text>
      <text x="40" y="25" textAnchor="middle" fill="#fff" fontFamily="Arial, sans-serif" fontWeight="600" fontSize="5.5">
        my name is
      </text>
      <text x="40" y="44" textAnchor="middle" fill="#141416" fontFamily="Caveat, cursive" fontSize="17" fontWeight="700">
        Yawe
      </text>
    </svg>
  );
}

export function LedgerNod({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 48" className={className} aria-hidden>
      <rect x="4" y="12" width="56" height="26" rx="6" fill="#141416" />
      <rect x="4" y="12" width="56" height="26" rx="6" fill="none" stroke="#000" strokeWidth="2" />
      <rect x="60" y="17" width="9" height="16" rx="2" fill="#848484" stroke="#000" strokeWidth="1.5" />
      <rect x="10" y="18" width="22" height="14" rx="2.5" fill="#2B5DF2" />
      <circle cx="44" cy="25" r="5.5" fill="none" stroke="#FCDD09" strokeWidth="2" />
      <path d="M44 21.5 v7 M40.5 25 h7" stroke="#FCDD09" strokeWidth="1.6" />
      <text x="21" y="28" textAnchor="middle" fill="#F7F5F0" fontFamily="monospace" fontSize="7" fontWeight="700">
        SOL
      </text>
    </svg>
  );
}

export function AnkoleCattle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 64" className={className} aria-hidden>
      {/* lyre horns */}
      <path d="M22 26 C 8 20, 4 8, 10 2 C 8 12, 14 18, 24 20" fill="#E8C87E" stroke="#8a5a2b" strokeWidth="1.5" />
      <path d="M50 26 C 64 20, 68 8, 62 2 C 64 12, 58 18, 48 20" fill="#E8C87E" stroke="#8a5a2b" strokeWidth="1.5" />
      {/* head */}
      <ellipse cx="36" cy="36" rx="14" ry="16" fill="#A0613A" />
      <ellipse cx="36" cy="44" rx="9" ry="8" fill="#C98D64" />
      <circle cx="30" cy="32" r="2" fill="#141416" />
      <circle cx="42" cy="32" r="2" fill="#141416" />
      <ellipse cx="33" cy="44" rx="1.6" ry="2.4" fill="#5a3520" />
      <ellipse cx="39" cy="44" rx="1.6" ry="2.4" fill="#5a3520" />
      <path d="M24 24 q3 -4 6 -1 M42 23 q3 -3 6 1" stroke="#5a3520" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function UgandaPin({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <clipPath id="ug-clip"><circle cx="32" cy="32" r="26" /></clipPath>
      </defs>
      <g clipPath="url(#ug-clip)">
        <rect x="4" y="6" width="56" height="9.5" fill="#141416" />
        <rect x="4" y="15.5" width="56" height="9.5" fill="#FCDD09" />
        <rect x="4" y="25" width="56" height="9.5" fill="#D50000" />
        <rect x="4" y="34.5" width="56" height="9.5" fill="#141416" />
        <rect x="4" y="44" width="56" height="9.5" fill="#FCDD09" />
        <rect x="4" y="53.5" width="56" height="9.5" fill="#D50000" />
      </g>
      <circle cx="32" cy="32" r="11" fill="#F7F5F0" />
      {/* crowned crane silhouette */}
      <path d="M32 25 q-4 1 -4 6 q0 4 4 5 l-1 4 h3 l-1 -4 q4 -1 4 -5 q0 -5 -5 -6 Z" fill="#848484" />
      <path d="M30 24 l1 -3 1 2.5 1 -3 1 3" stroke="#FCDD09" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="32" r="26" fill="none" stroke="#141416" strokeWidth="3" />
    </svg>
  );
}

export function DoveSticker({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      {/* the hidden dove (Holy Spirit) — tucked away, deliberately quiet */}
      <path
        d="M14 40 q10 -2 16 -10 q-2 -6 2 -10 q3 -3 7 -2 q-1 3 0 5 q6 -2 10 2 q-6 0 -8 4 q-2 8 -10 13 q-8 5 -17 -2 Z"
        fill="#F7F5F0"
        stroke="#848484"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="36.5" cy="20.5" r="1.3" fill="#141416" />
      <path d="M42 22 l6 1 -6 2 Z" fill="#FCDD09" />
      <path d="M20 44 q6 6 14 5" stroke="#7a9e4e" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function CoffeeSticker({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M24 12 q3 -4 0 -8 M32 14 q3 -4 0 -8 M40 12 q3 -4 0 -8" stroke="#848484" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M16 22 h32 v18 a12 12 0 0 1 -12 12 h-8 a12 12 0 0 1 -12 -12 Z" fill="#F7F5F0" stroke="#141416" strokeWidth="2.5" />
      <path d="M48 26 h4 a6 6 0 0 1 0 12 h-5" fill="none" stroke="#141416" strokeWidth="2.5" />
      <ellipse cx="32" cy="26" rx="12" ry="3" fill="#6b4226" />
      <text x="32" y="46" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="10" fill="#6b4226" fontWeight="700">
        KLA
      </text>
    </svg>
  );
}

export function CrownSticker({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path
        d="M12 44 L16 22 L26 33 L32 16 L38 33 L48 22 L52 44 Z"
        fill="#FCDD09"
        stroke="#8a6d00"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="20" r="3" fill="#FCDD09" stroke="#8a6d00" strokeWidth="1.6" />
      <circle cx="32" cy="14" r="3" fill="#FCDD09" stroke="#8a6d00" strokeWidth="1.6" />
      <circle cx="48" cy="20" r="3" fill="#FCDD09" stroke="#8a6d00" strokeWidth="1.6" />
      <rect x="12" y="44" width="40" height="7" rx="2.5" fill="#FCDD09" stroke="#8a6d00" strokeWidth="2" />
      <text x="32" y="49.5" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="6.5" fill="#5a4a00" letterSpacing="1">
        YHWH
      </text>
    </svg>
  );
}

/** The gold lion — the crest itself, pressed into a round sticker. */
export function LionSticker({ className = "" }: { className?: string }) {
  return (
    <span className={`grid place-items-center overflow-hidden rounded-full bg-azure ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/crest-badge.svg" alt="" className="h-[88%] w-[88%] object-contain" />
    </span>
  );
}
