import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Skip auth check for the auth page itself
  if (pathname === "/auth") {
    return NextResponse.next();
  }

  // Check if password query parameter exists and matches env variable
  const password = searchParams.get("password");
  const requiredPassword = process.env.PASSWORD;
  console.log("SOIHSDG:", password, requiredPassword);
  if (!password || password !== requiredPassword) {
    // Redirect to auth page, preserving the original URL as a query parameter
    const authUrl = new URL("/auth", request.url);
    authUrl.searchParams.set("returnUrl", request.url);
    return NextResponse.redirect(authUrl);
  }

  // Password is correct, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
