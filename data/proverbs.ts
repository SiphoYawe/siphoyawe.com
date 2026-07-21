export type Proverb = {
  id: string;
  /** Original language: Luganda or Runyankole. */
  lang: "Luganda" | "Runyankole";
  text: string;
  english: string;
};

/**
 * Rotating proverbs on the kitenge card (brief section 6.13).
 * TODO(Sipho): confirm wording and add your favourites.
 */
export const PROVERBS: Proverb[] = [
  {
    id: "kamu-kamu",
    lang: "Luganda",
    text: "Kamu kamu gwe muganda",
    english: "Little by little, a bundle is made.",
  },
  {
    id: "mbuulu",
    lang: "Luganda",
    text: "Agamba empanga atya ngo",
    english: "He who speaks plainly fears no leopard.",
  },
  {
    id: "rum-1",
    lang: "Runyankole",
    text: "Enyamaisha eteekateeka eri amaisho gabo",
    english: "Every herd has its own keeper. (confirm wording)",
  },
];
