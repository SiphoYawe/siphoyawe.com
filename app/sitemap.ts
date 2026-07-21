import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  return [
    {
      url: "https://siphoyawe.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://siphoyawe.com/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...posts.map((post) => ({
      url: `https://siphoyawe.com/blog/${post.slug}`,
      lastModified: new Date(`${post.date}T12:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];
}
