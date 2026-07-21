export default function Home() {
  return (
    <main className="mx-auto flex min-h-svh max-w-5xl flex-col items-center justify-center gap-6 px-6 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/crest-full-colour.svg" alt="Yawe coat of arms" className="w-40" />
      <p className="font-heraldic text-sm tracking-[0.35em] text-azure uppercase">
        Coram Deo
      </p>
      <h1 className="font-display text-6xl font-semibold tracking-tight sm:text-8xl">
        SIPHO YAWE
      </h1>
      <p className="max-w-md text-lg text-ink-soft">
        Phase 0 scaffold: tokens, fonts, themes, nav and i18n are live. The
        room gets furnished in the next phases.
      </p>
      <p className="font-hand text-2xl text-ink-soft">
        nothing to see here yet — check back soon
      </p>
    </main>
  );
}
