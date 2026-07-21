/**
 * Site-wide links. GitHub + LinkedIn confirmed from Sipho's CV.
 * TODO(Sipho): confirm X handle, preferred contact email, cal.com link,
 * and the Ready Scribe URL.
 */
export const SOCIALS = [
  { label: "X", href: "https://x.com/SiphoYawe", icon: "x" },
  { label: "GitHub", href: "https://github.com/SiphoYawe", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sipho-yawe-669406231/", icon: "linkedin" },
] as const;

export const CONTACT_EMAIL = "yawephillip@gmail.com";
export const CALCOM_LINK = "siphoyawe/intro"; // TODO(Sipho): confirm cal.com link
/** false until the cal.com link above is confirmed: the booking block then
 * shows a designed placeholder instead of cal.com's 404 box. */
export const CALCOM_CONFIRMED = false;
export const READY_SCRIBE_URL = "https://readyscribe.substack.com"; // TODO(Sipho): confirm
