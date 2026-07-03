import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const referer = req.nextUrl.searchParams.get("referer") || "https://www.miruro.to/";
  const origin = req.nextUrl.searchParams.get("origin") || "https://www.miruro.to/";

  if (!url) return NextResponse.json({ error: "missing url" }, { status: 400 });

  try {
    const proxyUrl = `https://api.aniheist.com/api/proxy/hls?url=${encodeURIComponent(url)}&referer=${encodeURIComponent(referer)}&origin=${encodeURIComponent(origin)}`;
    const resp = await fetch(proxyUrl, { signal: AbortSignal.timeout(20000) });
    if (!resp.ok) return new NextResponse(`upstream ${resp.status}`, { status: 502 });

    const ct = resp.headers.get("content-type") || "application/vnd.apple.mpegurl";
    const body = await resp.text();

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": ct,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch {
    return new NextResponse("proxy error", { status: 502 });
  }
}
