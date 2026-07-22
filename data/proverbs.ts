export type Proverb = {
  id: string;
  /** Original language: Luganda or Runyankole. */
  lang: "Luganda" | "Runyankole";
  text: string;
  english: string;
};

/**
 * Rotating proverbs on the kitenge card (brief section 6.13).
 * TODO(Sipho): repopulate with the curated Luganda + Runyankole proverbs.
 */
export const PROVERBS: Proverb[] = [];
