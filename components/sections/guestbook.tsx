import { Section } from "@/components/ui/section";
import { GuestbookWall } from "./guestbook-wall";

/**
 * Guestbook (brief section 6.16): a wall of sticky notes, no signup.
 * Static server component: the wall starts empty and the client refetches
 * /api/guestbook after mount, keeping the page SSG. Notes publish immediately
 * (spam-screened server-side) and Sipho is emailed on each one.
 */
export function Guestbook() {
  return (
    <Section
      id="guestbook"
      title="Leave a note"
      aside="no signup, just say hi"
    >
      <GuestbookWall initialEntries={[]} />
    </Section>
  );
}
