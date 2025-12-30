import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendSuccess,
  sendError,
  sendNotFoundError,
  sendValidationError,
} from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { logger } from "@/lib/logger";
import { z, ZodError } from "zod";

// Schema for updating user roles
const updateRoleSchema = z.object({
  role: z.enum(["ADMIN", "PROJECT_MANAGER", "TEAM_LEAD", "USER"]),
});

/**
 * GET /api/admin/users/[id]
 * Get specific user details
 * Access: Admin only
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    void req;
    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return sendValidationError("Invalid user ID", [
        { field: "id", message: "User ID must be a number" },
      ]);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profilePicture: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        projects: {
          select: {
            id: true,
            name: true,
            status: true,
            createdAt: true,
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          },
        },
        teams: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
        alerts: {
          select: {
            id: true,
            type: true,
            message: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return sendNotFoundError("User not found");
    }

    return sendSuccess(user, "User details retrieved successfully");
  } catch (error) {
    logger.error("Get user error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return sendError(
      "Failed to fetch user details",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}

/**
 * PATCH /api/admin/users/[id]
 * Update user role or details
 * Access: Admin only
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return sendValidationError("Invalid user ID", [
        { field: "id", message: "User ID must be a number" },
      ]);
    }

    const body = await req.json();

    // Validate if role is being updated
    if (body.role) {
      const validatedData = updateRoleSchema.parse({ role: body.role });
      body.role = validatedData.role;
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return sendNotFoundError("User not found");
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...body,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        updatedAt: true,
      },
    });

    return sendSuccess(updatedUser, "User updated successfully");
  } catch (error) {
    if (error instanceof ZodError) {
      return sendValidationError(
        "Validation failed",
        error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }))
      );
    }

    logger.error("Update user error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return sendError(
      "Failed to update user",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete a user
 * Access: Admin only
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);
    const adminId = parseInt(req.headers.get("x-user-id") || "0");

    if (isNaN(userId)) {
      return sendValidationError("Invalid user ID", [
        { field: "id", message: "User ID must be a number" },
      ]);
    }

    // Prevent admin from deleting themselves
    if (userId === adminId) {
      return sendValidationError("Cannot delete your own account", [
        { field: "id", message: "Self-deletion not allowed" },
      ]);
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return sendNotFoundError("User not found");
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id: userId },
    });

    return sendSuccess({ deletedUserId: userId }, "User deleted successfully");
  } catch (error) {
    logger.error("Delete user error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return sendError(
      "Failed to delete user",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}
