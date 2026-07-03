import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const searchParams = req.nextUrl.searchParams.toString();
  const apiPath = path.join("/");
  const apiUrl = process.env.API_INTERNAL_URL || "https://api.yourdomain.com";
  const url = `${apiUrl}/${apiPath}${searchParams ? `?${searchParams}` : ""}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "AniHeist-Frontend/2.0",
      },
      signal: AbortSignal.timeout(95000),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      return NextResponse.json(body, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=2592000, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Request failed";
    return NextResponse.json(
      { status: "error", error: { code: "PROXY_ERROR", message } },
      { status: 502 }
    );
  }
}
