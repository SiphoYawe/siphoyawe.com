/**
 * The stickered laptop lid (brief section 6.10): the stack and the loves,
 * each sticker linking out. Rendered as die-cut text pills (no logo art).
 * Placed on a 4x3 grid, with the centre-right cell left open so the crest
 * decal peeks through.
 */
export type LaptopSticker = {
  id: string;
  label: string;
  href: string;
  /** Sticker face colour. */
  color: "azure" | "or" | "gules" | "mint" | "sable" | "paper";
  rotate: number;
  /** Grid placement on the lid (column, row) for a hand-scattered feel. */
  col: 1 | 2 | 3 | 4;
  row: 1 | 2 | 3;
};

export const LAPTOP_STICKERS: LaptopSticker[] = [
  { id: "lifi", label: "LI.FI", href: "https://li.fi", color: "sable", rotate: -5, col: 1, row: 1 },
  { id: "vercel", label: "Vercel", href: "https://vercel.com", color: "sable", rotate: -3, col: 2, row: 1 },
  { id: "solana", label: "Solana", href: "https://solana.com", color: "gules", rotate: 5, col: 3, row: 1 },
  { id: "supabase", label: "Supabase", href: "https://supabase.com", color: "mint", rotate: 6, col: 4, row: 1 },
  { id: "claude", label: "Claude", href: "https://claude.ai", color: "or", rotate: -6, col: 1, row: 2 },
  { id: "typescript", label: "TypeScript", href: "https://www.typescriptlang.org", color: "azure", rotate: 3, col: 2, row: 2 },
  // col 3, row 2 is left open for the crest decal
  { id: "usdc", label: "USDC", href: "https://www.circle.com/usdc", color: "azure", rotate: 7, col: 1, row: 3 },
  // TODO(Sipho): swap for real logo assets if you get them.
  { id: "phaneroo", label: "Phaneroo", href: "https://phaneroo.org", color: "gules", rotate: -7, col: 2, row: 3 },
  { id: "zion", label: "Zion", href: "https://zionapp.co", color: "or", rotate: 2, col: 4, row: 3 },
];
