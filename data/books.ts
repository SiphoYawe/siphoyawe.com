export type Book = {
  id: string;
  title: string;
  author: string;
  /** Spine colour on the shelf. */
  spine: "azure" | "or" | "gules" | "mint" | "sable";
  /** Front-cover image; a typographic placeholder shows until one is set. */
  coverImage?: string;
  note?: string;
};

/**
 * The shelf (brief section 6.6): Sipho's real reading list. No cover art is
 * fabricated; the shelf renders each book from its title and author. The Bible
 * is permanent (scripture-as-object).
 */
export const BOOKS: Book[] = [
  {
    id: "weight-of-glory",
    title: "The Weight of Glory",
    author: "C.S. Lewis",
    spine: "sable",
    coverImage: "/images/books/weight-of-glory.webp",
  },
  {
    id: "david-perceived",
    title: "And David Perceived He Was King",
    author: "Dale L. Mast",
    spine: "gules",
    coverImage: "/images/books/david-perceived.webp",
  },
  {
    id: "the-scribe",
    title: "The Scribe",
    author: "James Goll",
    spine: "or",
    coverImage: "/images/books/the-scribe.webp",
  },
  {
    id: "saas-playbook",
    title: "The SaaS Playbook",
    author: "Rob Walling",
    spine: "azure",
    coverImage: "/images/books/saas-playbook.webp",
  },
  {
    id: "great-wealth-transfer",
    title: "The Great Wealth Transfer",
    author: "Peter Wagner",
    spine: "mint",
    coverImage: "/images/books/great-wealth-transfer.webp",
  },
];

export const BIBLE = {
  title: "The Bible",
  /** TODO(Sipho): swap for your life verse + reference if you'd like a different one. */
  verse:
    "Commit to the Lord whatever you do, and he will establish your plans.",
  reference: "Proverbs 16:3",
  translation: "NIV",
};
