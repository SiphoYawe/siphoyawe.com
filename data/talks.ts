export type Talk = {
  id: string;
  title: string;
  venue: string;
  date: string;
  href?: string;
  /** Lanyard (conference appearance) or torn ticket stub. */
  kind: "lanyard" | "stub";
};

/** Real appearances from Sipho's posts. TODO(Sipho): add rewatch links. */
export const TALKS: Talk[] = [
  {
    id: "circle-arc-livestream",
    title: "Chariot: cross-chain lending on Arc",
    venue: "Circle & Arc livestream",
    date: "2026",
    href: "https://lnkd.in/e9u8WY-P",
    kind: "lanyard",
  },
  {
    id: "ux-school",
    title: "UX School weekly design workshops",
    venue: "University of Sheffield",
    date: "2024 to 2025",
    kind: "lanyard",
  },
  {
    id: "spica-pitch",
    title: "Spica finalist pitch",
    venue: "Encode Agentic AI Hackathon, London",
    date: "2025",
    kind: "stub",
  },
  {
    id: "mina-pitch",
    title: "Mina finale pitch",
    venue: "Hyperliquid London Hackathon",
    date: "2026",
    kind: "stub",
  },
  {
    id: "ieee-pitch",
    title: "ToolOS startup pitch",
    venue: "IEEE Entrepreneurship",
    date: "2024",
    kind: "stub",
  },
];
