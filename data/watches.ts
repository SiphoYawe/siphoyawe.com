export type Watch = {
  id: string;
  brand: string;
  model: string;
  /** One line of why. */
  why: string;
  /** Strap/dial colour for the CSS-face fallback render. */
  tone: "azure" | "or" | "sable" | "steel";
  /** Transparent product photo; renders in the slot when present. */
  image?: string;
  /** On the wishlist, not the wrist: rendered greyed out. */
  wishlist?: boolean;
};

/** The collection, per Sipho. The last one is a hint, not a possession. */
export const WATCHES: Watch[] = [
  {
    id: "seiko-5-snxs79",
    brand: "Seiko",
    model: "5 (SNXS79)",
    why: "the everyday classic. Goes anywhere, forgives everything.",
    tone: "sable",
    image: "/images/watches/seiko-5-snxs79.webp",
  },
  {
    id: "opulens-spirit",
    brand: "Opulens",
    model: "Spirit (blue)",
    why: "blue dial, quiet flex. My everyday lift.",
    tone: "azure",
    image: "/images/watches/opulens-spirit.webp",
  },
  {
    id: "cartier-tank",
    brand: "Cartier",
    model: "Tank",
    why: "one day. Someone reading this can buy it for me.",
    tone: "steel",
    image: "/images/watches/cartier-tank.webp",
    wishlist: true,
  },
];
