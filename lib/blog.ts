import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Blog content (brief section 6, Blog): MDX files in content/posts.
 * Author flow: drop a .mdx file with frontmatter, commit, deploy.
 */

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  draft: boolean;
  readingTime: string;
  /** Optional cover image (frontmatter `cover`), used as the OG/article image. */
  cover?: string;
  /** Optional last-modified date (frontmatter `updated`), ISO yyyy-mm-dd. */
  updated?: string;
};

export type Post = PostMeta & { content: string };

function readingTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function toMeta(slug: string, data: Record<string, unknown>, content: string): PostMeta {
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    excerpt: String(data.excerpt ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: Boolean(data.draft),
    readingTime: readingTime(content),
    cover: data.cover ? String(data.cover) : undefined,
    updated: data.updated ? String(data.updated) : undefined,
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
      const { data, content } = matter(raw);
      return toMeta(slug, data, content);
    })
    .filter((post) => !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  const file = path.join(POSTS_DIR, `${slug}.mdx`);
  const alt = path.join(POSTS_DIR, `${slug}.md`);
  const target = fs.existsSync(file) ? file : fs.existsSync(alt) ? alt : null;
  if (!target) return null;
  const raw = fs.readFileSync(target, "utf8");
  const { data, content } = matter(raw);
  const meta = toMeta(slug, data, content);
  if (meta.draft) return null;
  return { ...meta, content };
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}
