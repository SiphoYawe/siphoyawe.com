import { Hero } from "@/components/hero/hero";
import { Preloader } from "@/components/preloader/preloader";
import { CraneMascot } from "@/components/crane/crane-mascot";
import { SocialDock } from "@/components/nav/social-dock";

/**
 * Phase 2 checkpoint: hero + signature interactions live. Placeholder
 * sections below carry the nav anchor ids until Phase 3 furnishes the room.
 */
export default function Home() {
  return (
    <main>
      <Preloader />
      <Hero />
      <CraneMascot />

      {["about", "work", "reading"].map((id) => (
        <section
          key={id}
          id={id}
          className="mx-auto grid min-h-[60vh] max-w-5xl scroll-mt-24 place-items-center px-6 py-24"
        >
          <p className="font-hand text-2xl text-ink-soft">
            the {id} section lands in phase 3
          </p>
        </section>
      ))}

      <section
        id="connect"
        className="mx-auto grid min-h-[60vh] max-w-5xl scroll-mt-24 place-items-center px-6 py-24"
      >
        <SocialDock />
      </section>
    </main>
  );
}
