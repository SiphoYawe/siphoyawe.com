import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. A stray parent lockfile
  // (~/package-lock.json) otherwise makes Next infer the wrong root, which can
  // break Vercel builds and file tracing.
  turbopack: {
    root: __dirname,
  },
  outputFileTracingRoot: __dirname,
  images: {
    // Spotify album art (real now-playing) and the dev placeholder host.
    remotePatterns: [
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "mosaic.scdn.co" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
};

export default nextConfig;
