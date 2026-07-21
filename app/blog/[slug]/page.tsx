import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllSlugs, getPost } from "@/lib/blog";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Illuminated drop cap on the post title's first letter (heraldic gold). */
function IlluminatedTitle({ title }: { title: string }) {
  const [first, ...rest] = title;
  return (
    <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
      <span aria-hidden className="mr-1 font-heraldic text-or drop-shadow-sm">
        {first}
      </span>
      <span className="sr-only">{first}</span>
      {rest.join("")}
    </h1>
  );
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-2xl px-5 pt-32 pb-24 sm:px-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 rounded-md text-sm text-ink-soft outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span aria-hidden>&larr;</span> all notes
      </Link>

      <header className="mt-8 mb-12">
        <p className="mb-3 font-heraldic text-[11px] tracking-[0.25em] text-ink-soft uppercase">
          {formatDate(post.date)}
          <span className="ml-3">{post.readingTime}</span>
        </p>
        <IlluminatedTitle title={post.title} />
        {post.tags.length > 0 && (
          <p className="mt-4 flex flex-wrap gap-2">
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
      </header>

      <article className="mdx-body">
        <MDXRemote source={post.content} />
      </article>

      <footer className="mt-16 border-t border-line pt-8">
        <p className="-rotate-2 font-hand text-xl text-ink-soft">coram deo</p>
      </footer>
    </main>
  );
}
