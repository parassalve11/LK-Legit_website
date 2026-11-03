import { NextResponse } from "next/server";

// Next.js 16 renamed Middleware to Proxy. This runs on every matched request,
// including prefetches, so it only reads the cookie — no database work here.
// Real authorisation lives in lib/dal.js next to the data.

const SESSION_COOKIE = "lk_session";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  const isLoginRoute = pathname === "/admin/login";

  // Unauthenticated visitors never see an admin URL.
  if (!isLoginRoute && !hasSessionCookie) {
    const url = new URL("/admin/login", request.nextUrl);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Already signed in? Skip the login screen.
  if (isLoginRoute && hasSessionCookie) {
    return NextResponse.redirect(new URL("/admin", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
