import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    name: "AniHeist",
    short_name: "AniHeist",
    description: "Stream anime in HD quality. Track your watch history, discover new anime.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    categories: ["entertainment", "video"],
    screenshots: [],
  });
}
