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
    why: "The everyday classic. Goes anywhere, forgives everything.",
    tone: "sable",
    image: "/images/watches/seiko-snxs79-v2.webp",
  },
  {
    id: "opulens-spirit",
    brand: "Opulens",
    model: "Spirit Blue",
    why: "Blue dial, quiet flex. My everyday lift.",
    tone: "azure",
    image: "/images/watches/opulens-spirit-v2.webp",
  },
  {
    id: "cartier-tank",
    brand: "Cartier",
    model: "Tank",
    why: "One day. Someone reading this can buy it for me.",
    tone: "steel",
    image: "/images/watches/cartier-tank.webp",
    wishlist: true,
  },
];
