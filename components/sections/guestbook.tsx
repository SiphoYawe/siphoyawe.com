import { Section } from "@/components/ui/section";
import { GuestbookWall } from "./guestbook-wall";

/**
 * Guestbook (brief section 6.16): a wall of sticky notes, no signup.
 * Static server component: the wall starts empty and the client refetches
 * /api/guestbook after mount, keeping the page SSG. Entries are
 * pre-moderated (backend section 8 of WIRING.md).
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
