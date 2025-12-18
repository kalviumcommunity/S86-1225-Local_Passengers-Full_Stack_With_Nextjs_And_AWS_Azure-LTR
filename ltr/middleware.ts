import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Define protected routes and their required roles
const protectedRoutes = {
  admin: ["/api/admin"],
  authenticated: [
    "/api/users",
    "/api/projects",
    "/api/tasks",
    "/api/teams",
    "/api/alerts",
    "/api/trains",
    "/api/reroutes",
    "/api/transactions",
    "/api/query-optimization",
  ],
};

/**
 * Middleware function to handle authorization
 * Validates JWT tokens and enforces role-based access control (RBAC)
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if the route requires admin access
  const requiresAdmin = protectedRoutes.admin.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the route requires authentication
  const requiresAuth = protectedRoutes.authenticated.some((route) =>
    pathname.startsWith(route)
  );

  // Skip middleware for public routes
  if (!requiresAdmin && !requiresAuth) {
    return NextResponse.next();
  }

  // Extract token from Authorization header or cookies
  const authHeader = req.headers.get("authorization");
  const tokenFromHeader = authHeader?.split(" ")[1];
  const tokenFromCookie = req.cookies.get("token")?.value;
  const token = tokenFromHeader || tokenFromCookie;

  // Return 401 if no token is provided
  if (!token) {
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
    // Verify and decode the JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
      role: string;
    };

    // Check if admin access is required
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

    // Attach user info to request headers for downstream handlers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", decoded.userId.toString());
    requestHeaders.set("x-user-email", decoded.email);
    requestHeaders.set("x-user-role", decoded.role);

    // Allow the request to proceed with updated headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Handle invalid or expired tokens
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        message: "Invalid or expired token. Please login again.",
        errorCode: "AUTH_TOKEN_INVALID",
        details: errorMessage,
      },
      { status: 403 }
    );
  }
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    "/api/admin/:path*",
    "/api/users/:path*",
    "/api/projects/:path*",
    "/api/tasks/:path*",
    "/api/teams/:path*",
    "/api/alerts/:path*",
    "/api/trains/:path*",
    "/api/reroutes/:path*",
    "/api/transactions/:path*",
    "/api/query-optimization/:path*",
  ],
};
