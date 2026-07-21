const URL_PATTERN = /\bhttps?:\/\/|\bwww\.|\b[a-z0-9-]+\.(com|net|org|io|xyz|ru|cn|info|biz|top|click|link)\b/gi;

// Deliberately short and sane — entries are pre-moderated anyway.
const BLOCKLIST = [
  "viagra",
  "cialis",
  "casino",
  "porn",
  "sex cam",
  "crypto giveaway",
  "free money",
  "nigger",
  "faggot",
  "cunt",
];

// Word-boundary matching avoids Scunthorpe-style false positives
// (e.g. "scunthorpe" must not trip on an embedded term).
const BLOCKLIST_PATTERNS = BLOCKLIST.map(
  (term) => new RegExp(`\\b${term.replace(/ /g, "\\s+")}\\b`, "i"),
);

const MAX_URLS = 2;

export type ModerationResult =
  | { ok: true }
  | { ok: false; reason: string };

export function screenMessage(message: string): ModerationResult {
  const urlMatches = message.match(URL_PATTERN);
  if (urlMatches && urlMatches.length > MAX_URLS) {
    return { ok: false, reason: "too many links" };
  }

  for (const pattern of BLOCKLIST_PATTERNS) {
    if (pattern.test(message)) {
      return { ok: false, reason: "blocked content" };
    }
  }

  return { ok: true };
}

export function countUrls(message: string): number {
  return message.match(URL_PATTERN)?.length ?? 0;
}
