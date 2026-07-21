import { Section } from "@/components/ui/section";
import { Kicker } from "@/components/ui/kicker";
import { getGuestbookSeed } from "@/lib/api";
import { GuestbookWall } from "./guestbook-wall";

/**
 * Guestbook (brief section 6.16): a wall of sticky notes, no signup.
 * Static server component: seeds the wall with the mock list (kept in sync
 * by getGuestbookSeed) and the client wall refetches /api/guestbook after
 * mount, so the page stays SSG until Claude's endpoint ships.
 */
export function Guestbook() {
  return (
    <Section
      id="guestbook"
      kicker={<Kicker k="guestbook" />}
      title="Leave a note"
      aside="no signup, just say hi"
    >
      <GuestbookWall initialEntries={getGuestbookSeed()} />
    </Section>
  );
}
