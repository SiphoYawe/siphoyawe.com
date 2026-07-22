/**
 * The stickered laptop lid (brief section 6.10): the stack and the loves,
 * each sticker linking out. Each entry renders as the AI-generated die-cut
 * logo image at `stickers-brand/sticker-<slug>` when that asset is present,
 * and falls back to a die-cut text pill (label + face colour) otherwise.
 * Placed on a 4x3 grid, with the col-3/row-2 cell left open so the crest
 * decal peeks through.
 */
export type LaptopSticker = {
  id: string;
  label: string;
  href: string;
  /** AI-asset slug: resolves to `stickers-brand/sticker-<slug>` when present. */
  slug: string;
  /** Fallback pill face colour (used when the logo image is absent). */
  color: "azure" | "or" | "gules" | "mint" | "sable" | "paper";
  rotate: number;
  /** Grid placement on the lid (column, row) for a hand-scattered feel. */
  col: 1 | 2 | 3 | 4;
  row: 1 | 2 | 3;
  /** Renders noticeably larger than the rest (the hero decal). */
  big?: boolean;
};

// TODO(Sipho): swap for real logo assets if you get them.
// Rebalanced after dropping TypeScript + Supabase: eight stickers, with
// Phaneroo enlarged as the bottom-centre anchor. col 3, row 2 stays open for
// the crest decal.
export const LAPTOP_STICKERS: LaptopSticker[] = [
  { id: "lifi-wordmark", label: "LI.FI", href: "https://li.fi", slug: "lifi-wordmark", color: "sable", rotate: -5, col: 1, row: 1 },
  { id: "metamask", label: "MetaMask", href: "https://metamask.io", slug: "metamask", color: "gules", rotate: 4, col: 2, row: 1 },
  { id: "vercel", label: "Vercel", href: "https://vercel.com", slug: "vercel", color: "sable", rotate: -3, col: 3, row: 1 },
  { id: "solana", label: "Solana", href: "https://solana.com", slug: "solana", color: "mint", rotate: 5, col: 4, row: 1 },
  { id: "claude", label: "Claude", href: "https://claude.ai", slug: "claude", color: "or", rotate: -6, col: 1, row: 2 },
  { id: "usdc", label: "USDC", href: "https://www.circle.com/usdc", slug: "usdc", color: "azure", rotate: 7, col: 4, row: 2 },
  { id: "zion", label: "Zion", href: "https://zionapp.co", slug: "zion", color: "or", rotate: 2, col: 1, row: 3 },
  { id: "phaneroo", label: "Phaneroo", href: "https://phaneroo.org", slug: "phaneroo", color: "gules", rotate: -7, col: 3, row: 3, big: true },
];
