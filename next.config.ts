import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.aniheist.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.aniheist.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/blog",
        destination: "https://blog.aniheist.com",
        permanent: true,
      },
      {
        source: "/api",
        destination: "https://api.aniheist.com",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
