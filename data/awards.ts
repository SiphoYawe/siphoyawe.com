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

/** Real honours from Sipho's CV and posts. */
export const AWARDS: Award[] = [
  {
    id: "hyperliquid",
    name: "1st Place, Hyperliquid London Hackathon",
    issuer: "Encode Club",
    year: "2026",
    detail: "Mina, $4,000, LI.FI bounty + crowd favourite",
    color: "azure",
  },
  {
    id: "encode",
    name: "1st Place, Encode Agentic AI Hackathon",
    issuer: "Encode Club",
    year: "2025",
    detail: "Spica, $2,500, built in 48 hours",
    color: "or",
  },
  {
    id: "chariot-spotlight",
    name: "Circle & Arc Spotlight",
    issuer: "Circle",
    year: "2026",
    detail: "Chariot, $1,000 award + livestream feature",
    color: "sable",
  },
  {
    id: "ieee",
    name: "3rd Place, IEEE Entrepreneurship",
    issuer: "IEEE",
    year: "2024",
    detail: "ToolOS, UX design & pitch",
    color: "gules",
  },
  {
    id: "merit-scholarship",
    name: "International Undergraduate Merit Scholarship",
    issuer: "University of Sheffield",
    year: "2023",
    detail: "The university's highest scholarship",
    color: "mint",
  },
  {
    id: "cs-excellence",
    name: "Computer Science Excellence Award",
    issuer: "University of Sheffield",
    year: "2025",
    detail: "Top academic performance, First Class Honours",
    color: "azure",
  },
];
