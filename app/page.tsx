import { Hero } from "@/components/hero/hero";
import { Preloader } from "@/components/preloader/preloader";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { WorkExperience } from "@/components/sections/work-experience";
// import { Awards } from "@/components/sections/awards"; // fridge section paused
import { Medals } from "@/components/sections/medals";
import { Reading } from "@/components/sections/reading";
import { Watches } from "@/components/sections/watches";
import { NowPlaying } from "@/components/sections/now-playing";
import { CorkboardNow } from "@/components/sections/corkboard-now";
import { StickerLaptop } from "@/components/sections/sticker-laptop";
import { DailyDrivers } from "@/components/sections/daily-drivers";
import { Talks } from "@/components/sections/talks";
import { Passport } from "@/components/sections/passport";
import { Proverb } from "@/components/sections/proverb";
import { Faith } from "@/components/sections/faith";
import { LatestWriting } from "@/components/sections/latest-writing";
import { Testimonials } from "@/components/sections/testimonials";
import { Guestbook } from "@/components/sections/guestbook";
import { Connect } from "@/components/sections/connect";
import { getAllPosts } from "@/lib/blog";

/**
 * The intimate scroll (brief section 5): seventeen sections, each a designed
 * artifact, in the brief's order. Hero closes with the wordmark; Connect
 * closes the page with the wax seal.
 */
export default function Home() {
  const [latestPost = null] = getAllPosts();

  return (
    <main id="main-content">
      <Preloader />
      <Hero />
      <About />
      <Projects />
      <WorkExperience />
      {/* <Awards /> fridge section paused */}
      <Medals />
      <Reading />
      <Watches />
      <NowPlaying />
      <CorkboardNow />
      <StickerLaptop />
      <DailyDrivers />
      <Talks />
      <Passport />
      <Proverb />
      <Faith />
      <LatestWriting post={latestPost} />
      <Testimonials />
      <Guestbook />
      <Connect />
    </main>
  );
}
