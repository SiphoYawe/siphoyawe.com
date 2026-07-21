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
      text: "Chariot on Arc, and this little corner of the internet.",
      rotate: -2,
    },
    {
      id: "reading",
      label: "reading",
      text: "The Weight of Glory by C.S. Lewis, plus the daily chapter.",
      rotate: 1.5,
    },
    {
      id: "listening",
      label: "listening",
      text: "Whatever the vinyl below is spinning. Taste varies, volume doesn't.",
      rotate: -1,
    },
    {
      id: "where",
      label: "where I am",
      text: "Between Sheffield and London, one train ahead of my luggage.",
      rotate: 2.5,
    },
  ] as const,
};
