import { NextRequest, NextResponse } from "next/server";
import {
  checkSitePassword,
  createSiteSession,
  SITE_SESSION_COOKIE,
  SITE_SESSION_SECONDS,
} from "@/lib/siteAuth";

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return NextResponse.json({ error: "Expected JSON" }, { status: 415 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("password" in body) ||
    typeof body.password !== "string" ||
    body.password.length > 1024
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    if (!checkSitePassword(body.password)) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }
    const response = NextResponse.json({ authenticated: true });
    response.cookies.set(SITE_SESSION_COOKIE, createSiteSession(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SITE_SESSION_SECONDS,
    });
    return response;
  } catch (error) {
    console.error("Site authentication configuration error:", error);
    return NextResponse.json({ error: "Site authentication is not configured" }, { status: 503 });
  }
}
