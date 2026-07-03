import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const referer = req.nextUrl.searchParams.get("r") || "";
  const origin = req.nextUrl.searchParams.get("o") || "";

  if (!url) {
    return new NextResponse("missing url", { status: 400 });
  }

  try {
    const hdrs: Record<string, string> = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "Accept": "*/*",
      "Accept-Language": "en-US,en;q=0.9",
    };
    if (referer) hdrs["Referer"] = referer;
    if (origin) hdrs["Origin"] = origin;

    const res = await fetch(url, {
      headers: hdrs,
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      return new NextResponse(`upstream ${res.status}`, { status: 502 });
    }

    const ct = res.headers.get("content-type") || "application/vnd.apple.mpegurl";
    let body = await res.text();

    // Rewrite relative .ts URLs to absolute CDN URLs
    // This ensures segments load directly from CDN (which may not check Referer on segments)
    const baseUrl = new URL(url);
    body = body.replace(/^(\/.*\.ts)$/gm, (match) => {
      return `${baseUrl.origin}${match}`;
    });
    body = body.replace(/^((?!https?:\/\/).*\.ts)$/gm, (match) => {
      const dir = baseUrl.pathname.substring(0, baseUrl.pathname.lastIndexOf("/") + 1);
      return `${baseUrl.origin}${dir}${match}`;
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
