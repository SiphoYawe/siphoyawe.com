export type Medal = {
  id: string;
  /** Project or entry name, engraved on the caption plate. */
  name: string;
  /** The event it was won at. */
  event: string;
  /** The result line (1st place, First Prize...). */
  result: string;
  /** False while Sipho confirms the details (placeholder caption). */
  confirmed: boolean;
};

/**
 * First-place hackathon finishes, hung on the medal rack (brief: three wins +
 * one ghost slot teasing the next). These overlap with the Talks ticket stubs
 * by design: stubs are the events he entered, medals are the ones he won.
 * TODO(Sipho): confirm the exact third win and the Blueshift project name
 * (Assembly Timeout vs Hyperliquid) — see NEEDS-SIPHO.md.
 */
export const MEDALS: Medal[] = [
  {
    id: "spica-scoop-ai",
    name: "Spica",
    event: "Scoop AI Hackathon, SpoonOS",
    result: "1st place",
    confirmed: true,
  },
  {
    id: "hyperliquid-blueshift",
    name: "Hyperliquid",
    event: "Blueshift Challenge, Superteam UK",
    result: "First Prize, 300 USDG",
    confirmed: true,
  },
  {
    id: "third-win",
    name: "Win no. 3",
    event: "details being confirmed",
    result: "1st place",
    confirmed: false,
  },
];
