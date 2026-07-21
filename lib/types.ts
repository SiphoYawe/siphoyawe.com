import type { GuestbookInput, SpeakingInput } from "@/lib/server/validation";

/**
 * Shared content + API types. The form payload types come straight from the
 * backend's zod schemas (lib/server/validation.ts, type-only import) so the
 * frontend and route handlers can never drift.
 */

export type SpeakingInquiry = SpeakingInput;
export type GuestbookSignature = GuestbookInput;

export type NowPlaying = {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumArtUrl?: string;
  songUrl?: string;
  lastPlayed?: {
    title: string;
    artist: string;
    album?: string;
    albumArtUrl?: string;
    songUrl?: string;
  };
  /** Present when the backend is running its dev/mock mode. */
  _mock?: true;
};

export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  approved?: boolean;
};

/** POST /api/guestbook answer: entries are pre-moderated (brief section 10),
 * so a successful sign comes back pending, never instantly public. */
export type GuestbookSignResult = { ok: boolean; pending?: boolean };
