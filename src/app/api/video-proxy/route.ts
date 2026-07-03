import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "missing url" }, { status: 400 });

  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!resp.ok) return new NextResponse(`upstream ${resp.status}`, { status: 502 });

    const ct = resp.headers.get("content-type") || "application/octet-stream";
    let body = await resp.text();

    // Rewrite relative .ts/.m3u8 URLs to go through this proxy
    const baseUrl = url.substring(0, url.lastIndexOf("/") + 1);
    body = body.replace(/^((\.\/)?(?!https?:\/\/)\S+\.(ts|m3u8|vtt|key|aac|mp4|webm))/gm, (match) => {
      const absolute = new URL(match, url).href;
      return `/api/video-proxy?url=${encodeURIComponent(absolute)}`;
    });

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": ct,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=30",
      },
    });
  } catch {
    return new NextResponse("proxy error", { status: 502 });
  }
}
