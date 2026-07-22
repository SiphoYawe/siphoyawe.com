export type Talk = {
  id: string;
  title: string;
  venue: string;
  date: string;
  href?: string;
  /** Result or detail line (hackathon placing, views, co-presenter). */
  note?: string;
  /** Lanyard (a talk / appearance) or torn ticket stub (a hackathon). */
  kind: "lanyard" | "stub";
};

/**
 * Media, talks, and hackathons (brief section 6.11). Lanyards are speaking
 * appearances; the ticket stubs are hackathon entries and results. Grounded in
 * CONTENT-DATA + Sipho's confirmed facts.
 */
export const TALKS: Talk[] = [
  {
    id: "arc-spotlight",
    title: "Chariot: crosschain collateral lending on Arc",
    venue: "Arc Enterprise & DeFi Hackathon Spotlight",
    date: "May 2026",
    href: "https://x.com/i/broadcasts/1mxPaLQOEOyKN",
    note: "With Sam Sealey. 160k+ views.",
    kind: "lanyard",
  },
  {
    id: "scoop-ai",
    title: "Spica",
    venue: "Scoop AI Hackathon, Encode x SpoonOS",
    date: "2026",
    href: "https://www.linkedin.com/posts/spoonos_scoop-ai-hackathon-winner-compilation-activity-7417480958188089344-uTTz",
    kind: "stub",
  },
  {
    id: "hyperliquid",
    title: "Mina",
    venue: "Hyperliquid Hackathon, Encode",
    date: "Jan 2026",
    href: "https://www.encodeclub.com/programmes/hyperliquid-london-hackathon",
    kind: "stub",
  },
  {
    id: "arc-hackathon",
    title: "Chariot",
    venue: "Arc DeFi Hackathon, Encode",
    date: "May 2026",
    href: "https://community.arc.io/home/events/arc-enterprise-and-defi-hackathon-spotlight-chariot-crosschain-collateral-lending-protocol-on-arc-umne213eet",
    kind: "stub",
  },
];
