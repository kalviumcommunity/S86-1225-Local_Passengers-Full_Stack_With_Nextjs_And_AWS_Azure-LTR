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
import { userRegistrationSchema } from "@/lib/schemas";
import { ZodError } from "zod";

/**
 * POST /api/auth/register
 * Register a new user
 * Access: Public
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input using Zod schema
    const validatedData = userRegistrationSchema.parse(body);
    const { email, password, name } = validatedData;

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
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return sendValidationError(
        "Validation failed",
        error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }))
      );
    }

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
