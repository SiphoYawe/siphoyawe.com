"use client";

import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import type { PostMeta } from "@/lib/blog";

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
 * A single teaser card for the most recent blog post, so the homepage always
 * points at the newest writing without a full index. Renders nothing if
 * there are no posts yet.
 */
export function LatestWriting({ post }: { post: PostMeta | null }) {
  if (!post) return null;

  return (
    <Section id="writing" title="Latest writing" aside="fresh off the press">
      <Reveal>
        <Link
          href={`/blog/${post.slug}`}
          className="group block rounded-2xl border border-line bg-canvas-raised p-6 shadow-(--shadow-polaroid) transition-shadow outline-none hover:shadow-(--shadow-lift) focus-visible:ring-2 focus-visible:ring-accent sm:p-8"
        >
          <p className="font-sans font-semibold text-[11px] tracking-[0.25em] text-ink-soft uppercase">
            {formatDate(post.date)}
            {post.readingTime && <span className="ml-3">{post.readingTime}</span>}
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-balance group-hover:text-accent sm:text-3xl">
            {post.title}
          </h3>
          <p className="mt-3 leading-relaxed text-ink-soft">{post.excerpt}</p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
            Read it
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden
              className="size-4 transition-transform group-hover:translate-x-0.5"
            >
              <path d="M5 12h14m0 0-5-5m5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
        <Link
          href="/blog"
          className="mt-4 inline-block rounded-md text-sm text-ink-soft underline decoration-line underline-offset-4 outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-accent"
        >
          All notes
        </Link>
      </Reveal>
    </Section>
  );
}
