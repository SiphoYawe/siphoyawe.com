export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  /** Source link where possible. */
  href?: string;
  photo?: string;
};

/**
 * Kind words. Every entry is a labelled placeholder (brief: never invent
 * realistic-looking fake testimonials). TODO(Sipho): real quotes + photos.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "placeholder-1",
    quote:
      "Placeholder quote. A real kind word from a collaborator goes here, with their name and a link back to the source.",
    name: "Name TBD",
    role: "Role, company",
  },
  {
    id: "placeholder-2",
    quote:
      "Placeholder quote. Think of the hackathon judges, the LI.FI team, a UX School student, a Chariot user.",
    name: "Name TBD",
    role: "Role, company",
  },
  {
    id: "placeholder-3",
    quote:
      "Placeholder quote. Two or three sentences is plenty. Specific beats glowing every time.",
    name: "Name TBD",
    role: "Role, company",
  },
];
