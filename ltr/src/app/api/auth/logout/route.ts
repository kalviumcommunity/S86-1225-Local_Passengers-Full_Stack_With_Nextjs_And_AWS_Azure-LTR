import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/tokenStorage";

/**
 * POST /api/auth/logout
 * Logout user and clear authentication tokens
 *
 * Security:
 * - Clears both access and refresh token cookies
 * - Invalidates session on client side
 * - Sets cookies with maxAge=0 to expire immediately
 *
 * Access: Any user (authenticated or not)
 */
export async function POST(_req: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Logout successful",
      },
      { status: 200 }
    );

    // Clear both access and refresh token cookies
    clearAuthCookies(response);

    return response;
  } catch {
    // Error occurred during logout
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
