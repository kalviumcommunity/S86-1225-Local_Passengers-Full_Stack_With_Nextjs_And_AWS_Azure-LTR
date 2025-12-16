import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 * Logout user
 * Access: Authenticated User
 */
export async function POST(_req: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );

    // Clear the token cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expire immediately
    });

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
