import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "./src/lib/jwt";
import { getAccessToken } from "./src/lib/tokenStorage";

/**
 * Next.js Middleware with JWT Token Validation
 *
 * This middleware implements Role-Based Access Control (RBAC) using JWT tokens
 * It validates access tokens and enforces role-based permissions
 *
 * Security Features:
 * - JWT signature verification using HS256 algorithm
 * - Token expiry validation
 * - Role-based authorization
 * - Secure token extraction from headers and cookies
 * - Automatic token refresh suggestion on expiry
 *
 * Protected Routes:
 * - Admin routes: Require ADMIN role
 * - Station Master routes: Require STATION_MASTER or ADMIN role
 * - Authenticated routes: Require any valid token
 */

// Define protected routes and their required roles for Local Train Passengers System
const protectedRoutes = {
  admin: ["/api/admin"],
  stationMaster: ["/api/station-master"],
  authenticated: [
    "/api/users",
    "/api/alerts",
    "/api/trains",
    "/api/reroutes",
    "/api/upload",
    "/api/files",
  ],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Optional HTTPS enforcement (recommended to also enable at the platform level)
  // Works behind proxies/load balancers by checking x-forwarded-proto.
  if (process.env.FORCE_HTTPS === "true") {
    const forwardedProto = req.headers.get("x-forwarded-proto");
    if (forwardedProto === "http") {
      const url = req.nextUrl.clone();
      url.protocol = "https:";
      return NextResponse.redirect(url, 308);
    }
  }

  // API-level RBAC handling
  const requiresAdmin = protectedRoutes.admin.some((route) =>
    pathname.startsWith(route)
  );
  const requiresStationMaster = protectedRoutes.stationMaster.some((route) =>
    pathname.startsWith(route)
  );
  const requiresAuth = protectedRoutes.authenticated.some((route) =>
    pathname.startsWith(route)
  );

  // Page-level protected routes for the routing demo
  const isRoutingDemoProtected =
    pathname.startsWith("/routing-demo/dashboard") ||
    pathname.startsWith("/routing-demo/users");

  // Skip auth check for refresh endpoint to avoid circular dependency
  if (pathname === "/api/auth/refresh") {
    return NextResponse.next();
  }

  // If neither API nor routing-demo pages require auth, continue
  if (
    !requiresAdmin &&
    !requiresStationMaster &&
    !requiresAuth &&
    !isRoutingDemoProtected
  ) {
    return NextResponse.next();
  }

  // Extract access token from Authorization header or cookies
  const token = getAccessToken(req);

  if (!token) {
    // If it's a routing-demo page, redirect to the demo login page
    if (isRoutingDemoProtected) {
      const loginUrl = new URL("/routing-demo/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Otherwise return JSON 401 for API
    return NextResponse.json(
      {
        success: false,
        message: "Authentication required. Token missing.",
        errorCode: "AUTH_TOKEN_MISSING",
        hint: "Please login or include a valid access token in your request",
      },
      { status: 401 }
    );
  }

  try {
    // Verify access token using new JWT library
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      // Token is invalid or expired
      throw new Error("Invalid or expired access token");
    }

    // API role checks
    if (requiresAdmin && decoded.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Admin privileges required.",
          errorCode: "FORBIDDEN_ACCESS",
        },
        { status: 403 }
      );
    }

    if (
      requiresStationMaster &&
      decoded.role !== "STATION_MASTER" &&
      decoded.role !== "ADMIN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Station Master privileges required.",
          errorCode: "FORBIDDEN_STATION_MASTER",
        },
        { status: 403 }
      );
    }

    // For API requests attach user headers
    if (requiresAdmin || requiresStationMaster || requiresAuth) {
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", decoded.userId.toString());
      requestHeaders.set("x-user-email", decoded.email);
      requestHeaders.set("x-user-role", decoded.role);
      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    // For routing-demo pages, allow access (no role checks) after successful verification
    if (isRoutingDemoProtected) {
      return NextResponse.next();
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid or expired token
    if (isRoutingDemoProtected) {
      const loginUrl = new URL("/routing-demo/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // For API calls, return 401 with suggestion to refresh token
    return NextResponse.json(
      {
        success: false,
        message: "Invalid or expired access token.",
        errorCode: "TOKEN_EXPIRED",
        hint: "Your access token has expired. Call /api/auth/refresh to get a new token using your refresh token.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: [
    "/api/admin/:path*",
    "/api/station-master/:path*",
    "/api/users/:path*",
    "/api/alerts/:path*",
    "/api/trains/:path*",
    "/api/reroutes/:path*",
    "/api/upload/:path*",
    "/api/files/:path*",
    // routing demo pages
    "/routing-demo/dashboard/:path*",
    "/routing-demo/users/:path*",
  ],
};
