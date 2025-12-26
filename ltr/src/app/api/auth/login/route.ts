import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { userLoginSchema } from "@/lib/schemas";
import { ZodError } from "zod";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { setAuthCookies } from "@/lib/tokenStorage";

/**
 * POST /api/auth/login
 * Authenticate user and issue JWT tokens
 *
 * Flow:
 * 1. Validate credentials
 * 2. Generate access token (15 min expiry)
 * 3. Generate refresh token (7 day expiry)
 * 4. Set both tokens as HTTP-only cookies
 * 5. Return user info
 *
 * Security:
 * - Passwords hashed with bcrypt
 * - Tokens stored as HTTP-only, SameSite cookies
 * - Access token short-lived to minimize risk
 * - Refresh token for seamless re-authentication
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = userLoginSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Create response with user data
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      tokens: {
        accessToken, // Also include in response for client-side storage if needed
        expiresIn: "15m",
      },
    });

    // Set secure HTTP-only cookies
    setAuthCookies(response, accessToken, refreshToken);

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.issues },
        { status: 400 }
      );
    }

    // Error occurred
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
