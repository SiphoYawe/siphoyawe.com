export type Book = {
  id: string;
  title: string;
  author: string;
  /** Spine colour on the shelf. */
  spine: "azure" | "or" | "gules" | "mint" | "sable";
  /** The current read gets the red ribbon bookmark. */
  current?: boolean;
  note?: string;
};

/**
 * The shelf. TODO(Sipho): replace the placeholder reads with your real list.
 * The Bible is permanent (brief section 6.6: scripture-as-object).
 */
export const BOOKS: Book[] = [
  {
    id: "placeholder-1",
    title: "Your current read",
    author: "TBD (Sipho)",
    spine: "azure",
    current: true,
    note: "placeholder book, swap me out",
  },
  {
    id: "placeholder-2",
    title: "A book you love",
    author: "TBD (Sipho)",
    spine: "or",
  },
  {
    id: "placeholder-3",
    title: "What shaped you",
    author: "TBD (Sipho)",
    spine: "mint",
  },
];

export const BIBLE = {
  title: "The Bible",
  /** TODO(Sipho): your life verse + reference for the openable moment. */
  verse:
    "Commit to the Lord whatever you do, and he will establish your plans.",
  reference: "Proverbs 16:3",
  translation: "NIV",
};
