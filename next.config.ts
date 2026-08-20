import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Home-dir package-lock.json makes Next infer /Users/avishka as the
  // workspace root, so Turbopack never registers src/app routes (all 404).
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.zervtek.com" },
    ],
  },
  async headers() {
    return [
      {
        // Discourage hotlinking / indexing of raw uploaded originals.
        source: "/uploads/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noimageindex" }],
      },
      {
        source: "/media/vehicles/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noimageindex" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
