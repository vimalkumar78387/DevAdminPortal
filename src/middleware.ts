import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

const PROTECTED_PATHS = ["/admin", "/api/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtected) {
    const session = await verifySessionToken(
      request.cookies.get(SESSION_COOKIE_NAME)?.value
    );
    if (!session) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === "/login") {
    const session = await verifySessionToken(
      request.cookies.get(SESSION_COOKIE_NAME)?.value
    );
    if (session) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = "/admin";
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/admin/:path*", "/api/admin/:path*"],
};
