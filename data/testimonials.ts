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
 * Kind words from people Sipho has worked with. Real quotes, supplied by Sipho.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "ronald-azairwe",
    quote:
      "In my experience, I have found Sipho very serious, dexterous, and committed to his work. He has shown great self-motivation, ambition and determination to accomplish his tasks and to fulfil his obligations.",
    name: "Ronald Azairwe",
    role: "Pegasus Technologies Limited",
  },
  {
    id: "chukwudi-m",
    quote:
      "Working with Sipho has been exceptional! Throughout his internship, he has consistently demonstrated organizational skills, delivering high-quality work promptly. His positive attitude and dedication to excellence makes him a valuable asset to any team. It's been a pleasure working with Sipho.",
    name: "Chukwudi M.",
    role: "Skybound Studio",
  },
  {
    id: "charlotte-muheki",
    quote:
      "Sipho is a dynamic individual, brimming with creativity. Sipho's commitment to excellence is unwavering, ensuring that every task is executed to the highest standard. His problem-solving skills are exceptional, often thinking beyond conventional boundaries to provide innovative solutions.",
    name: "Charlotte Muheki",
    role: "Dabar Schools",
  },
  {
    id: "andrew-muhwezi",
    quote:
      "I like that Sipho has a structured approach to things, and will document things to the detail, a very scarce attribute. Sipho is keen on continuous improvement, grasps concepts very easily, and is willing to ask and research those he is unsure of. I enjoy the value he brings to meetings, beyond the scope of his assignments.",
    name: "Andrew Muhwezi",
    role: "Penda Capital",
  },
];
