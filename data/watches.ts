export type Watch = {
  id: string;
  brand: string;
  model: string;
  /** One line of why. */
  why: string;
  /** Strap/dial colour for the render. */
  tone: "azure" | "or" | "sable" | "steel";
  /** On the wishlist, not the wrist: rendered greyed out. */
  wishlist?: boolean;
};

/** The collection, per Sipho. The last one is a hint, not a possession. */
export const WATCHES: Watch[] = [
  {
    id: "seiko-skx",
    brand: "Seiko",
    model: "SKX (black dial)",
    why: "the classic. Goes anywhere, forgives everything.",
    tone: "sable",
  },
  {
    id: "opulens-spirit",
    brand: "Opulens",
    model: "Spirit (blue)",
    why: "blue dial, quiet flex. My everyday lift.",
    tone: "azure",
  },
  {
    id: "cartier-tank",
    brand: "Cartier",
    model: "Tank",
    why: "one day. Someone reading this can buy it for me.",
    tone: "steel",
    wishlist: true,
  },
];
