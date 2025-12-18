import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendSuccess,
  sendError,
  sendValidationError,
} from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { z } from "zod";

// Schema for updating user roles
const updateRoleSchema = z.object({
  role: z.enum(["ADMIN", "PROJECT_MANAGER", "TEAM_LEAD", "USER"]),
});

/**
 * GET /api/admin/users
 * Get all users with detailed information
 * Access: Admin only
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (role) {
      where.role = role;
    }

    // Get users with pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              projects: true,
              tasks: true,
              teams: true,
              alerts: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return sendSuccess(
      {
        users,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      },
      "Users retrieved successfully"
    );
  } catch (error) {
    console.error("Get users error:", error);
    return sendError(
      "Failed to fetch users",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}

/**
 * POST /api/admin/users
 * Create a new user (admin privilege)
 * Access: Admin only
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return sendValidationError("User with this email already exists", [
        { field: "email", message: "Email already in use" },
      ]);
    }

    // Hash password
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return sendSuccess(newUser, "User created successfully", 201);
  } catch (error) {
    console.error("Create user error:", error);
    return sendError(
      "Failed to create user",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}
