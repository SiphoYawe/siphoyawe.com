/**
 * The corkboard "now" page (brief section 6.9): four pinned index cards,
 * updated periodically. TODO(Sipho): refresh whenever life moves.
 */
export const NOW = {
  updated: "July 2026",
  cards: [
    {
      id: "building",
      label: "building",
      text: "Zion, and everything LI.FI is doing across the ecosystem.",
      rotate: -2,
    },
    {
      id: "predicting",
      label: "predicting",
      text: "The Clarity Act passing is going to be huge for crypto this year.",
      rotate: 1.5,
    },
    {
      id: "obsessing",
      label: "obsessing over",
      text: "RWAs, onchain tokenization, and Jerusalem archaeology from Jesus's time.",
      rotate: -1,
    },
    {
      id: "vision",
      label: "next 3 months",
      text: "Using AI to ride the changing SaaS landscape and solve niche problems.",
      rotate: 2.5,
    },
  ] as const,
};
