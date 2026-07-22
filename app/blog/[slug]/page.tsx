import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllSlugs, getPost } from "@/lib/blog";
import { JsonLd, SITE_URL } from "@/components/seo/json-ld";
import { EmailGate } from "@/components/blog/email-gate";

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
  const publishedTime = post.date ? `${post.date}T12:00:00Z` : undefined;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${slug}`,
      siteName: "Sipho Yawe",
      locale: "en_GB",
      publishedTime,
      authors: ["Sipho Yawe"],
      // A per-post cover wins; otherwise fall back to the site card (overriding
      // openGraph drops the inherited opengraph-image.png file convention).
      images: [
        post.cover
          ? { url: post.cover }
          : { url: "/opengraph-image.png", width: 1200, height: 630, alt: "Sipho Yawe" },
      ],
    },
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

  const url = `${SITE_URL}/blog/${slug}`;
  const datePublished = post.date ? `${post.date}T12:00:00Z` : undefined;
  const dateModified = post.updated
    ? `${post.updated}T12:00:00Z`
    : datePublished;
  const image = post.cover
    ? new URL(post.cover, SITE_URL).toString()
    : `${SITE_URL}/opengraph-image.png`;

  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished,
    dateModified,
    image,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Person", name: "Sipho Yawe", url: SITE_URL },
    publisher: { "@type": "Person", name: "Sipho Yawe", url: SITE_URL },
    inLanguage: "en-GB",
  };

  return (
    <main id="main-content" className="mx-auto max-w-2xl px-5 pt-32 pb-24 sm:px-8">
      <JsonLd data={blogPostingLd} />
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 rounded-md text-sm text-ink-soft outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span aria-hidden>&larr;</span> all notes
      </Link>

      <header className="mt-8 mb-12">
        <p className="mb-3 font-sans font-semibold text-[11px] tracking-[0.25em] text-ink-soft uppercase">
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

      {post.gatedPdf && <EmailGate pdf={post.gatedPdf} note={post.gateNote} />}

      <footer className="mt-16 border-t border-line pt-8">
        <p className="-rotate-2 font-hand text-xl text-ink-soft">coram deo</p>
      </footer>
    </main>
  );
}
