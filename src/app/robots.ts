import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/", "/watch/"],
      },
    ],
    sitemap: "https://aniheist.com/sitemap.xml",
  };
}
