import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

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

  // If neither API nor routing-demo pages require auth, continue
  if (
    !requiresAdmin &&
    !requiresStationMaster &&
    !requiresAuth &&
    !isRoutingDemoProtected
  ) {
    return NextResponse.next();
  }

  // Extract token from Authorization header or cookies
  const authHeader = req.headers.get("authorization");
  const tokenFromHeader = authHeader?.split(" ")[1];
  const tokenFromCookie = req.cookies.get("token")?.value;
  const token = tokenFromHeader || tokenFromCookie;

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
      },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
      role: string;
    };

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

    return NextResponse.json(
      {
        success: false,
        message: "Invalid or expired token.",
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
