// Middleware is no longer needed for authentication since we use Convex Auth client-side
// Keep this file minimal to avoid any routing issues
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Allow all requests through - authentication is handled client-side by Convex Auth
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
