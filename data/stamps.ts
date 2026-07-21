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
 * Travel stamps, Kampala to the UK (brief section 6.12). Grounded in real
 * journeys (including the Madrid layover saga). TODO(Sipho): confirm dates.
 */
export const STAMPS: Stamp[] = [
  { id: "kampala", place: "ENTEBBE", caption: "home", date: "origin", ink: "sable", rotate: -8 },
  { id: "sheffield", place: "SHEFFIELD", caption: "uni years", date: "2022", ink: "azure", rotate: 5 },
  { id: "london", place: "LONDON", caption: "hackathon city", date: "2025", ink: "gules", rotate: -4 },
  { id: "madrid", place: "MADRID", caption: "the layover lesson", date: "2025", ink: "gules", rotate: 9 },
  { id: "dublin", place: "DUBLIN", caption: "legal transit, phew", date: "2026", ink: "azure", rotate: -6 },
  { id: "usa", place: "USA", caption: "first stateside trip", date: "2026", ink: "sable", rotate: 7 },
];

/** Journey note next to the map. */
export const JOURNEY_NOTE =
  "Kampala raised me, Sheffield schooled me, London is building me.";
