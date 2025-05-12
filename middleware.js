import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const { pathname, origin } = req.nextUrl;
  console.log("Middleware triggered for path:", pathname);
  const token = req.cookies.get("token")?.value;

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
    "/account/forgot-password",
    "/account/reset-password",
    "/verify-email",
    "/account/verify-otp", // Add verify-otp to public routes
  ];

  const isPublicRoute = publicRoutes.includes(pathname);
  const is2FAPending = req.cookies.get("twofa_pending")?.value === "true";

  // Handle 2FA pending state
  if (is2FAPending) {
    if (pathname !== "/account/verify-otp") {
      return NextResponse.redirect(new URL("/account/verify-otp", origin));
    }
    return NextResponse.next();
  }

  // Handle public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If no token and not public route → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  try {
    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userRole = payload?.role;
    const username = payload?.username;

    // If user is admin trying to access user routes or vice versa
    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", origin));
    }

    // User route protection
    if (pathname.startsWith("/user")) {
      if (userRole !== "user") {
        return NextResponse.redirect(new URL("/", origin));
      }

      // Redirect to dashboard if trying to access base user path
      if (pathname === "/user" || pathname === `/user/${username}`) {
        return NextResponse.redirect(
          new URL(`/user/${username}/dashboard`, origin)
        );
      }
    }

    // Admin dashboard redirection
    if (pathname === "/admin" && userRole === "admin") {
      return NextResponse.next(); // Let the admin page handle the redirection
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

// export const config = {
//   matcher: ["/((?!api|_next|static|.*\\..*).*)"],
// };

export const config = {
  matcher: ["/((?!api|_next|images|favicon.ico|robots.txt).*)"], // Exclude static files and API routes
};

