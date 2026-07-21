/**
 * Shared content + API types. Content lives as typed data files in the repo
 * (brief section 10: no CMS, Sipho fills the data).
 */

export type NowPlaying = {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumArtUrl?: string;
  songUrl?: string;
};

export type SpeakingInquiry = {
  name: string;
  email: string;
  org?: string;
  eventName: string;
  eventDate?: string;
  audienceSize?: string;
  budget?: string;
  message: string;
  /** Honeypot — must stay empty. */
  website?: string;
  /** Cloudflare Turnstile token (Claude provides the site key). */
  turnstileToken?: string;
};

export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  approved: boolean;
};

export type GuestbookSignature = {
  name: string;
  message: string;
  /** Honeypot — must stay empty. */
  website?: string;
  turnstileToken?: string;
};
