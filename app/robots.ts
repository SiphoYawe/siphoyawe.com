import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/styleguide"] },
    sitemap: "https://siphoyawe.com/sitemap.xml",
  };
}
