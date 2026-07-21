export type Watch = {
  id: string;
  brand: string;
  model: string;
  /** One line of why. */
  why: string;
  /** Placeholder photo until Sipho shoots the roll. */
  photo?: string;
  /** Strap/dial colour for the placeholder render. */
  tone: "azure" | "or" | "sable" | "steel";
};

/** TODO(Sipho): the real collection. All entries are labelled placeholders. */
export const WATCHES: Watch[] = [
  {
    id: "placeholder-1",
    brand: "Watch one",
    model: "Brand & model TBD",
    why: "the daily wearer, tell its story here",
    tone: "sable",
  },
  {
    id: "placeholder-2",
    brand: "Watch two",
    model: "Brand & model TBD",
    why: "the occasion piece, tell its story here",
    tone: "steel",
  },
  {
    id: "placeholder-3",
    brand: "Watch three",
    model: "Brand & model TBD",
    why: "the one with a story, tell it here",
    tone: "azure",
  },
];
