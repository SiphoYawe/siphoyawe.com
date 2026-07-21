# siphoyawe.com

Sipho Yawe's personal corner of the internet: an intimate, lived-in room full of
his real things, not a resume. Built around the Yawe coat of arms: Azure, Or,
Gules, Sable, a gold lion rampant, and the motto CORAM DEO.

Spec: `../BUILD-BRIEF.md` (design locked 2026-07-21). Brand assets:
`../brand-assets/exports/`. Design forensics: `../design-references/`.

## Stack

Next.js 16 (App Router) + TypeScript, Tailwind v4 (palette as tokens in
`app/globals.css`), Framer Motion (springs only, see `lib/motion.ts`),
next-intl (decorative EN/LG/RN toggle, client-side, no routing), next-themes,
@calcom/embed-react, MDX blog via next-mdx-remote + gray-matter.
Fully static (SSG). Deploy target: Vercel.

```bash
npm run dev      # develop
npm run build    # production build (all routes must stay static)
npm run lint     # eslint, must be clean
node scripts/screenshot.mjs http://localhost:3000 out.png [w] [h] [full] [dark] [hoverSel] [hoverMs]
```

## Where things live

- `data/*.ts` — all content (typed, no CMS). Edit these first.
- `messages/{en,lg,rn}.json` — the small translated surface (greetings, kickers).
- `content/posts/*.mdx` — blog posts. Frontmatter: title, date, excerpt, tags, draft.
- `components/ui/` — design-system primitives (see `/styleguide`).
- `components/sections/` — the 17 scroll sections.
- `lib/api.ts` — the backend seam. Mocks until Claude's route handlers land.
- `lib/analytics.ts` — PostHog seam, no-ops without env keys.

## Backend (ported from Claude's staging package, backend/WIRING.md)

Route handlers in `app/api/` + server modules in `lib/server/`. All four
surfaces run in a labelled dev/mock mode with zero env vars and go live when
the matching secrets are set (`.env.example`):

1. `GET /api/now-playing` — Spotify; `_mock: true` while unconfigured.
2. `POST /api/speaking` — zod + honeypot + Turnstile + rate limit + Resend.
3. `GET|POST /api/guestbook` — Neon (or in-memory store); POST returns
   `{ ok, pending: true }`, entries are pre-moderated.
   `GET|POST /api/guestbook/moderate` — token-gated approval (404 when wrong).
4. PostHog EU — client taxonomy in `lib/analytics.ts` (frozen with
   `lib/server/analytics.ts` CLIENT_EVENTS); route handlers emit server events.

One-time setup scripts: `npm run spotify:auth` (mint the refresh token),
`psql "$DATABASE_URL" -f db/schema.sql` (guestbook table).

## Flags and decisions

- `CALCOM_CONFIRMED` in `data/socials.ts`: flip to `true` once the cal.com
  link is real; the booking block swaps the placeholder for the live embed.
- Signature: `public/brand/signature-{black,white}.png` is variant v2; swap
  with v1/v3 from `../brand-assets/exports/wordmark/` to change.
- Two loud moments only (hard rule): the neon Connect button and the
  per-letter hero stickers. Everything else stays quiet.
- Easter eggs: per-letter hero stickers, the crane mascot, hidden dove,
  project-card stickers, and a hidden terminal (press `) with `whoami`,
  `sipho --help`, `verse`, `coram deo`, and a Konami surprise.

## AI-generated assets (AI-ASSET-PROMPTS.md)

Every artifact has a hand-built SVG/CSS version live NOW and an AI slot that
replaces it when the generated final lands. Workflow:

1. Finals are filed in `../content-drop/ai-assets/<section>/<name>.png`
   (slot keys in the doc: `hero/sticker-*`, `mascot/crane-*`, `artifacts/*`,
   `textures/kitenge`, `stamps/stamp-*`).
2. `npm run sync:assets` (also runs on predev/prebuild) copies them to
   `public/assets/ai/` and rebuilds `lib/generated/ai-assets.json`.
3. Components resolve slots via `aiAsset()` from `lib/ai-assets.ts` and
   render the image when present, the fallback otherwise. No code changes
   needed per drop.
4. Commit `public/assets/ai/**` and `lib/generated/ai-assets.json` so the
   Vercel build carries the finals.

Wired slots: 7 hero stickers (hello tag overlays "Yawe" in code), crane
mascot (peek-bottom/peek-side), bookshelf, bible, watch roll, vinyl deck,
fridge, corkboard, laptop lid, passport spread + kampala/london/yawe-seal
stamps, kitenge texture, lanyard, ticket stub, wax seal.
- Reduced motion is respected everywhere; test with an OS reduce-motion flag.
