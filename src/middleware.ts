import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

// Routes that require authentication
const PROTECTED_ROUTES = ["/profile", "/my-uploads", "/saved", "/following", "/papers/upload"];

// Routes that require admin role
const ADMIN_ROUTES = ["/admin"];

// Auth routes (redirect to home if already logged in)
const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("auth_token")?.value ?? null;
  const payload = token ? await verifyToken(token) : null;
  const isAuthenticated = !!payload;
  const isAdmin = payload?.role === "admin";

  // Redirect logged-in users away from auth pages
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/search", request.url));
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login?redirect=/admin", request.url));
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/search", request.url));
    }
    return NextResponse.next();
  }

  // Protect user-only routes
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url)
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/my-uploads/:path*",
    "/saved/:path*",
    "/following/:path*",
    "/papers/upload/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
