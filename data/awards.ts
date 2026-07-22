export type Award = {
  id: string;
  name: string;
  issuer: string;
  year: string;
  /** Prize or distinction, shown small. */
  detail?: string;
  /** Magnet face colour. */
  color: "azure" | "or" | "gules" | "mint" | "sable";
};

/**
 * The fridge magnets (brief section 6.3): academic honours from the University
 * of Sheffield. Hackathon wins live in the Talks & media section instead.
 */
export const AWARDS: Award[] = [
  {
    id: "merit-scholarship",
    name: "International Merit Scholarship",
    issuer: "University of Sheffield",
    year: "2023",
    detail: "Sheffield's highest scholarship",
    color: "or",
  },
  {
    id: "cs-excellence",
    name: "Computer Science Excellence Award",
    issuer: "University of Sheffield",
    year: "2025",
    detail: "Top academic performance",
    color: "azure",
  },
];
