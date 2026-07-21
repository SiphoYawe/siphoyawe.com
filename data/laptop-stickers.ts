/**
 * The stickered laptop lid (brief section 6.10): the stack and the loves,
 * each sticker linking out. Art is a short label rendered as a die-cut
 * sticker; swap for real logo art later if wanted.
 */
export type LaptopSticker = {
  id: string;
  label: string;
  href: string;
  /** Sticker face colour. */
  color: "azure" | "or" | "gules" | "mint" | "sable" | "paper";
  rotate: number;
  /** Grid placement on the lid (column, row) for a hand-scattered feel. */
  col: 1 | 2 | 3;
  row: 1 | 2 | 3;
};

export const LAPTOP_STICKERS: LaptopSticker[] = [
  { id: "solidity", label: "Solidity", href: "https://soliditylang.org", color: "sable", rotate: -6, col: 1, row: 1 },
  { id: "lifi", label: "LI.FI", href: "https://li.fi", color: "azure", rotate: 4, col: 2, row: 1 },
  { id: "nextjs", label: "Next.js", href: "https://nextjs.org", color: "sable", rotate: -3, col: 3, row: 1 },
  { id: "arc", label: "Arc", href: "https://www.arc.network", color: "azure", rotate: 7, col: 1, row: 2 },
  { id: "hyperliquid", label: "Hyperliquid", href: "https://hyperliquid.xyz", color: "mint", rotate: -5, col: 2, row: 2 },
  { id: "ledger", label: "Ledger", href: "https://www.ledger.com", color: "sable", rotate: 2, col: 3, row: 2 },
  { id: "typescript", label: "TypeScript", href: "https://www.typescriptlang.org", color: "azure", rotate: 5, col: 1, row: 3 },
  { id: "foundry", label: "Foundry", href: "https://getfoundry.sh", color: "gules", rotate: -7, col: 2, row: 3 },
  { id: "figma", label: "Figma", href: "https://www.figma.com", color: "or", rotate: 3, col: 3, row: 3 },
];
