import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  sendSuccess,
  sendValidationError,
  sendConflictError,
  sendError,
} from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";

/**
 * POST /api/auth/register
 * Register a new user
 * Access: Public
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    // Validate input
    if (!email || !password) {
      return sendValidationError("Email and password are required");
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return sendConflictError("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split("@")[0],
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return sendSuccess(user, "User registered successfully", 201);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Registration error:", error);
    return sendError(
      "Failed to register user",
      ERROR_CODES.USER_CREATION_FAILED,
      500,
      error
    );
  }
}
