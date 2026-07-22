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
 * one ghost slot teasing the next). All three are Encode Club hackathons; they
 * overlap with the Talks ticket stubs by design: stubs are the events he
 * entered, medals are the ones he won.
 */
export const MEDALS: Medal[] = [
  {
    id: "spica-scoop-ai",
    name: "Spica",
    event: "Scoop AI Hackathon, Encode x SpoonOS",
    result: "1st place",
    confirmed: true,
  },
  {
    id: "mina-hyperliquid",
    name: "Mina",
    event: "Hyperliquid Hackathon, Encode",
    result: "1st place",
    confirmed: true,
  },
  {
    id: "chariot-arc",
    name: "Chariot",
    event: "Arc DeFi Hackathon, Encode",
    result: "1st place",
    confirmed: true,
  },
];
