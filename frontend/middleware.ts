import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("isLoggedIn")?.value;
  const { pathname } = request.nextUrl;

  const protectedPaths = [
    "/dashboard",
    "/check-in",
    "/check-out",
    "/parking-list",
  ];

  const isProtected = protectedPaths.some(path =>
    pathname.startsWith(path)
  );

  if (isProtected && isLoggedIn !== "true") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
