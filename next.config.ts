import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
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
