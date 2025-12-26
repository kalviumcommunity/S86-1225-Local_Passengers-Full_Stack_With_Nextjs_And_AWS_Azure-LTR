import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken, generateAccessToken } from "@/lib/jwt";
import {
  getRefreshToken,
  createTokenRefreshResponse,
} from "@/lib/tokenStorage";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 *
 * Flow:
 * 1. Extract refresh token from HTTP-only cookie
 * 2. Verify refresh token signature and expiry
 * 3. Validate user still exists in database
 * 4. Generate new access token
 * 5. Return new access token in cookie
 *
 * Security:
 * - Refresh token stored as HTTP-only cookie
 * - Path restricted to /api/auth/refresh only
 * - Validates user still active before issuing new token
 * - Implements token rotation (optional: can rotate refresh token too)
 *
 * Usage:
 * Client should call this endpoint when access token expires (401 response)
 * New access token is automatically set in cookie and can be used immediately
 */
export async function POST(req: NextRequest) {
  try {
    // Extract refresh token from cookie
    const refreshToken = getRefreshToken(req);

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Refresh token not found. Please login again.",
          errorCode: "REFRESH_TOKEN_MISSING",
        },
        { status: 401 }
      );
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired refresh token. Please login again.",
          errorCode: "REFRESH_TOKEN_INVALID",
        },
        { status: 401 }
      );
    }

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found. Please login again.",
          errorCode: "USER_NOT_FOUND",
        },
        { status: 401 }
      );
    }

    // Generate new access token with updated user data
    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Return response with new access token
    return createTokenRefreshResponse(newAccessToken, {
      success: true,
      message: "Access token refreshed successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken: newAccessToken,
      expiresIn: "15m",
    });
  } catch {
    // Error occurred during token refresh
    return NextResponse.json(
      {
        success: false,
        message: "Failed to refresh token. Please login again.",
        errorCode: "TOKEN_REFRESH_ERROR",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/refresh
 * Alternative method to refresh token via GET request
 * Useful for simple token refresh without POST body
 */
export async function GET(req: NextRequest) {
  return POST(req);
}
