/** Site-wide links, all confirmed by Sipho. */
export const SOCIALS = [
  { label: "X", href: "https://x.com/SiphoYawe", icon: "x" },
  { label: "GitHub", href: "https://github.com/SiphoYawe", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sipho-yawe-669406231/", icon: "linkedin" },
  { label: "Ready Scribe", href: "https://readyscribe17.substack.com", icon: "substack" },
] as const;

export const CONTACT_EMAIL = "yawephillip@gmail.com";
/** cal.com booking handle. Comes from NEXT_PUBLIC_CAL_LINK, with Sipho's
 * confirmed link as the build-time fallback. */
export const CALCOM_LINK = process.env.NEXT_PUBLIC_CAL_LINK || "sipho-yawe/30min";
/** The cal.com link is confirmed, so the booking block renders the live embed
 * instead of the designed placeholder. */
export const CALCOM_CONFIRMED = true;
export const READY_SCRIBE_URL = "https://readyscribe17.substack.com";
