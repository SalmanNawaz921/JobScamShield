import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const { pathname, origin } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // Bypass static files and public assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt")
  ) {
    return NextResponse.next();
  }

  // Define public routes
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/pricing",
    "/no-credits",
    "/about-us",
    "/about",
    "/terms",
    "/term&condition",
    "/salespage",
  ];
  const isPublicRoute = publicRoutes.includes(pathname);
  const is2FAPending = req.cookies.get("twofa_pending")?.value === "true";
  if (is2FAPending && pathname.startsWith("/account/verify-otp")) {
    return NextResponse.next();
  }
  
  // Handle public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If no token and not public route → redirect to login
  if (!token  ) {
    console.log("No token found, redirecting to login");
    return NextResponse.redirect(new URL("/login", origin));
  }

  try {
    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    const userRole = payload?.role;
    const username = payload?.username;

    // Admin route protection
    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/login", origin));
    }

    // User route protection
    if (pathname.startsWith("/user") && !pathname.startsWith(`/user/${username}`)) {
      return NextResponse.redirect(new URL(`/user/${username}/dashboard`, origin));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed", err);
    // Clear invalid token and redirect
    const response = NextResponse.redirect(new URL("/login", origin));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/((?!api|_next|images|favicon.ico|robots.txt).*)"],
};