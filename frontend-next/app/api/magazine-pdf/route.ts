import { NextRequest, NextResponse } from "next/server";

const allowedHosts = new Set(["sahomeschooling.com", "www.sahomeschooling.com"]);

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("url");

  if (!source) {
    return NextResponse.json({ error: "Missing PDF URL." }, { status: 400 });
  }

  let pdfUrl: URL;

  try {
    pdfUrl = new URL(source);
  } catch {
    return NextResponse.json({ error: "Invalid PDF URL." }, { status: 400 });
  }

  if (!allowedHosts.has(pdfUrl.hostname) || !pdfUrl.pathname.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "PDF URL is not allowed." }, { status: 400 });
  }

  const upstream = await fetch(pdfUrl.toString(), {
    headers: {
      accept: "application/pdf",
    },
    next: {
      revalidate: 3600,
    },
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Could not load magazine PDF." }, { status: upstream.status || 502 });
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/pdf",
      "content-length": upstream.headers.get("content-length") ?? "",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
