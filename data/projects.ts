import type { ChipColor } from "@/components/ui/tag-chip";

export type Project = {
  id: string;
  name: string;
  oneLiner: string;
  tags: { label: string; color: ChipColor }[];
  /** Screenshot/mockup; placeholder until Sipho ships real shots. */
  image?: string;
  links: { live?: string; github?: string };
  /** Hide a sticker inside this card (easter egg). */
  hiddenSticker?: boolean;
  year: string;
};

/** Real projects, grounded in Sipho's GitHub + posts (CONTENT-DATA). */
export const PROJECTS: Project[] = [
  {
    id: "chariot",
    name: "Chariot",
    oneLiner:
      "Crosschain collateral lending on Arc: deposit ETH, borrow USDC at dynamic rates, and earn dual yield from lending and tokenized T-bills.",
    tags: [
      { label: "Solidity", color: "purple" },
      { label: "DeFi", color: "blue" },
      { label: "Arc", color: "mint" },
      { label: "RWA", color: "orange" },
    ],
    links: { live: "https://onchariot.co", github: "https://github.com/SiphoYawe/Chariot" },
    hiddenSticker: true,
    year: "2026",
  },
  {
    id: "zion",
    name: "Zion",
    oneLiner:
      "A comprehensive school-management platform for ACE curriculum schools: administration, records, and reporting in one place.",
    tags: [
      { label: "Next.js", color: "blue" },
      { label: "Supabase", color: "mint" },
      { label: "SaaS", color: "purple" },
    ],
    links: { live: "https://zionapp.co" },
    year: "2025",
  },
  {
    id: "spica",
    name: "Spica",
    oneLiner:
      "Build DeFi workflows with AI: turn plain English into executable, autonomous blockchain automation.",
    tags: [
      { label: "AI", color: "pink" },
      { label: "DeFi", color: "blue" },
      { label: "Automation", color: "orange" },
    ],
    links: { github: "https://github.com/SiphoYawe/Spica" },
    hiddenSticker: true,
    year: "2026",
  },
  {
    id: "mina",
    name: "Mina",
    oneLiner:
      "Bridge from 40+ chains and trade on Hyperliquid: pair trading, basket trades, and leverage, with an open SDK and CLI.",
    tags: [
      { label: "TypeScript", color: "blue" },
      { label: "Crosschain", color: "orange" },
      { label: "Hyperliquid", color: "pink" },
    ],
    links: { github: "https://github.com/SiphoYawe/Mina" },
    year: "2026",
  },
  {
    id: "cardpass",
    name: "CardPass",
    oneLiner:
      "My first shipped app, now live. Full write-up coming soon.",
    tags: [
      { label: "Mobile", color: "blue" },
      { label: "App", color: "purple" },
    ],
    links: { live: "https://cardpass.app" },
    year: "2025",
  },
];
