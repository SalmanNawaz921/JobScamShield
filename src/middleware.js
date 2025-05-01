import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
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
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!token && !isPublicRoute) {
    console.log("No token found, redirecting to login page");
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isPublicRoute) {
    return NextResponse.next();
  }

  try {
    // Direct token verification using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET); // or hardcoded for testing
    const { payload } = await jwtVerify(token, secret);
    console.log("Token verified successfully", payload);
    const userRole = payload?.role;
    const username = payload?.username;
    if (userRole === "admin" && !pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (
      userRole !== "admin" &&
      !pathname.startsWith(`/user/${username}/dashboard`)
    ) {
      return NextResponse.redirect(
        new URL(`/user/${username}/dashboard`, req.url)
      );
    }
    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed", err);
    return NextResponse.redirect(new URL("/auth", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next|images|favicon.ico|robots.txt).*)"],
};
