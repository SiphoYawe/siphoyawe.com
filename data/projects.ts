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

/** Real projects, grounded in Sipho's CV and posts. Copy: Sipho to refine. */
export const PROJECTS: Project[] = [
  {
    id: "chariot",
    name: "Chariot",
    oneLiner:
      "Cross-chain lending on Circle's Arc: lock ETH on Ethereum, borrow USDC on Arc, no bridging your collateral.",
    tags: [
      { label: "Solidity", color: "purple" },
      { label: "DeFi", color: "blue" },
      { label: "Arc", color: "mint" },
    ],
    links: { live: "https://onchariot.co" },
    hiddenSticker: true,
    year: "2026",
  },
  {
    id: "mina",
    name: "Mina",
    oneLiner:
      "One-click onboarding to Hyperliquid from 40+ chains: web platform, open-source SDK, and a CLI.",
    tags: [
      { label: "TypeScript", color: "blue" },
      { label: "Bridges", color: "orange" },
      { label: "CLI", color: "pink" },
    ],
    links: { live: "https://usemina.co", github: "https://github.com/SiphoYawe" },
    year: "2026",
  },
  {
    id: "zion",
    name: "Zion",
    oneLiner:
      "A full-stack school management SaaS with predictive analytics, now running in pilot institutions.",
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
      "Describe DeFi workflows in plain English; Spica builds and runs them autonomously on Neo N3.",
    tags: [
      { label: "AI agents", color: "pink" },
      { label: "Neo N3", color: "mint" },
      { label: "x402", color: "orange" },
    ],
    links: { github: "https://github.com/SiphoYawe/spica" },
    hiddenSticker: true,
    year: "2025",
  },
  {
    id: "cardpass",
    name: "CardPass",
    oneLiner:
      "Scan your student ID, add it to Apple Wallet. My first app, born in a library queue.",
    tags: [
      { label: "React Native", color: "blue" },
      { label: "Expo", color: "purple" },
      { label: "iOS", color: "pink" },
    ],
    links: { live: "https://cardpass.app" },
    year: "2025",
  },
];
