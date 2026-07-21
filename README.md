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

## Backend seams (Claude owns the server side)

Four surfaces, contracted in `lib/api.ts` + `lib/types.ts`:

1. `GET /api/now-playing` — Spotify; drives the vinyl (`isPlaying` = spin).
2. `POST /api/speaking` — speaking form; zod-validated client-side already,
   honeypot field `website`, Turnstile placeholder in the UI.
3. `GET|POST /api/guestbook` — wall renders `approved` only; seed + client
   refetch keeps the page SSG.
4. PostHog — event names in `lib/analytics.ts`; hooks already fire on outbound
   links, cal.com, form submits, section views.

Env vars: `.env.example`.

## Flags and decisions

- `CALCOM_CONFIRMED` in `data/socials.ts`: flip to `true` once the cal.com
  link is real; the booking block swaps the placeholder for the live embed.
- Signature: `public/brand/signature-{black,white}.png` is variant v2; swap
  with v1/v3 from `../brand-assets/exports/wordmark/` to change.
- Two loud moments only (hard rule): the neon Connect button and the
  per-letter hero stickers. Everything else stays quiet.
- Reduced motion is respected everywhere; test with an OS reduce-motion flag.
