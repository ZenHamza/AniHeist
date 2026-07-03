import { MetadataRoute } from "next";

const BASE = "https://aniheist.com";
const API = process.env.API_INTERNAL_URL || "https://api.aniheist.com";

const GENRES = ["Action","Adventure","Comedy","Drama","Ecchi","Fantasy","Horror","Mahou Shoujo","Mecha","Music","Mystery","Psychological","Romance","Sci-Fi","Slice of Life","Sports","Supernatural","Thriller"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "hourly", priority: 1.0 },
    { url: `${BASE}/trending`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/popular`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/recent`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
    { url: `${BASE}/genres`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE}/legal/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/legal/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/legal/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/legal/dmca`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/legal/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/legal/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  // Genre pages
  const genrePages: MetadataRoute.Sitemap = GENRES.map((g) => ({
    url: `${BASE}/genre/${encodeURIComponent(g)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  // Top 50 most popular anime detail pages (fetched from API)
  let animePages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API}/api/popular?per_page=50`, {
      signal: AbortSignal.timeout(10000),
    });
    const json = await res.json();
    if (json.status === "success" && json.data) {
      animePages = json.data.map((a: { id: number; title: string }) => ({
        url: `${BASE}/anime/${a.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.5,
      }));
    }
  } catch {}

  return [
    ...staticPages,
    ...genrePages,
    ...animePages,
  ];
}
