import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { JsonLd, SITE_URL } from "@/components/seo/json-ld";

const BLOG_DESCRIPTION =
  "Build notes, cross-chain musings, and slow writing from Sipho Yawe: DeFi, DevRel, and the occasional slower note on faith and work.";

export const metadata: Metadata = {
  title: "Blog",
  description: BLOG_DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: "Blog — Sipho Yawe",
    description: BLOG_DESCRIPTION,
    url: `${SITE_URL}/blog`,
    siteName: "Sipho Yawe",
    locale: "en_GB",
    // Overriding openGraph drops the inherited opengraph-image.png file, so
    // point back at the site card explicitly.
    images: [
      { url: "/opengraph-image.png", width: 1200, height: 630, alt: "Sipho Yawe" },
    ],
  },
};

const blogLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": `${SITE_URL}/blog#blog`,
  name: "Thinking out loud",
  description: BLOG_DESCRIPTION,
  url: `${SITE_URL}/blog`,
  inLanguage: "en-GB",
  author: { "@type": "Person", name: "Sipho Yawe", url: SITE_URL },
};

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * /blog (brief: a quiet reading space). Posts are MDX files in the repo;
 * drop a file, commit, deploy.
 */
export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main id="main-content" className="mx-auto max-w-2xl px-5 pt-32 pb-24 sm:px-8">
      <JsonLd data={blogLd} />
      <header className="mb-14">
        <p className="mb-3 font-sans font-semibold text-xs tracking-[0.3em] text-accent uppercase">
          The blog
        </p>
        <h1 className="font-display text-5xl font-semibold tracking-tight">Thinking out loud</h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          Essays and notes on what I build and what I believe. Cross-chain and
          DeFi, writing, faith and work, and the occasional slower read.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="font-hand text-2xl text-ink-soft">
          nothing here yet, the kettle is still on
        </p>
      ) : (
        <ul className="grid gap-10">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <p className="font-sans font-semibold text-[11px] tracking-[0.25em] text-ink-soft uppercase">
                  {formatDate(post.date)}
                  {post.readingTime && <span className="ml-3">{post.readingTime}</span>}
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-balance group-hover:text-accent group-focus-visible:text-accent">
                  {post.title}
                </h2>
                <p className="mt-2 leading-relaxed text-ink-soft">{post.excerpt}</p>
                {post.tags.length > 0 && (
                  <p className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-line px-2.5 py-0.5 text-xs text-ink-soft"
                      >
                        {tag}
                      </span>
                    ))}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
