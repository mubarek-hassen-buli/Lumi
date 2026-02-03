import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

export default async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:4000",
      headers: {
        // get the cookie from the request
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  // Check if user is on auth pages (sign-in, sign-up)
  const isAuthPage = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');

  // If user has session and is on auth page, redirect to dashboard
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If no session and trying to access protected route, redirect to sign-in
  if (!session && !isAuthPage) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/editor/:path*", "/create", "/sign-in", "/sign-up"],
};
