import { NextRequest, NextResponse } from "next/server";
import { isValidSiteSession, SITE_SESSION_COOKIE } from "./lib/siteAuth";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (
    path === "/login" ||
    path === "/api/auth/login" ||
    path === "/api/line/webhook" ||
    path === "/api/sanity/revalidate" ||
    path === "/favicon.ico" ||
    path === "/kubota-logo.png"
  ) {
    return NextResponse.next();
  }

  try {
    if (isValidSiteSession(request.cookies.get(SITE_SESSION_COOKIE)?.value)) {
      return NextResponse.next();
    }
  } catch (error) {
    console.error("Site authentication configuration error:", error);
    return new NextResponse("Site authentication is not configured.", { status: 503 });
  }

  if (path.startsWith("/api/") || request.method !== "GET") {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  return NextResponse.rewrite(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
