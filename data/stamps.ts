export type Stamp = {
  id: string;
  place: string;
  /** Stamp inscription. */
  caption: string;
  date: string;
  /** Stamp ink colour. */
  ink: "azure" | "gules" | "sable";
  /** Rotation of the pressed stamp. */
  rotate: number;
};

/**
 * Passport stamps (brief section 6.12): the places Sipho has been, Uganda home
 * first. Per Sipho: UK, USA, Dubai, South Africa, Kenya.
 */
export const STAMPS: Stamp[] = [
  { id: "uganda", place: "UGANDA", caption: "home", date: "origin", ink: "sable", rotate: -8 },
  { id: "uk", place: "UNITED KINGDOM", caption: "where I live and build", date: "", ink: "azure", rotate: 5 },
  { id: "usa", place: "USA", caption: "first stateside trip", date: "", ink: "gules", rotate: -5 },
  { id: "dubai", place: "DUBAI", caption: "desert stopover", date: "", ink: "azure", rotate: 9 },
  { id: "south-africa", place: "SOUTH AFRICA", caption: "down south", date: "", ink: "gules", rotate: -6 },
  { id: "kenya", place: "KENYA", caption: "neighbours up north", date: "", ink: "sable", rotate: 7 },
];
