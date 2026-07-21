import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Build notes, cross-chain musings, and slow writing from Sipho Yawe.",
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
    <main className="mx-auto max-w-2xl px-5 pt-32 pb-24 sm:px-8">
      <header className="mb-14">
        <p className="mb-3 font-heraldic text-xs tracking-[0.3em] text-accent uppercase">
          The desk
        </p>
        <h1 className="font-display text-5xl font-semibold tracking-tight">Notes, by hand</h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          Build notes, cross-chain musings, and the occasional slower note.
          Written by a person, for a person.
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
                <p className="font-heraldic text-[11px] tracking-[0.25em] text-ink-soft uppercase">
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
