import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import {
  sendSuccess,
  sendAuthError,
  sendError,
} from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production";

// Middleware to verify JWT and get user
async function verifyAuth(req: NextRequest) {
  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
      role: string;
    };
    return decoded;
  } catch {
    return null;
  }
}

/**
 * GET /api/files/[id]
 * Retrieve a specific file by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await verifyAuth(req);

    if (!authUser) {
      return sendAuthError("Not authenticated");
    }

    const { id } = await params;
    const fileId = parseInt(id);

    if (isNaN(fileId)) {
      return sendError("Invalid file ID", "INVALID_ID", 400);
    }

    // Fetch file
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!file) {
      return sendError("File not found", "FILE_NOT_FOUND", 404);
    }

    // Check access permissions
    if (
      authUser.role !== "ADMIN" &&
      file.uploadedBy !== authUser.userId &&
      !file.isPublic
    ) {
      return sendError(
        "You don't have permission to access this file",
        "FORBIDDEN",
        403
      );
    }

    return sendSuccess(file, "File retrieved successfully", 200);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("File retrieval error:", error);
    return sendError(
      "Failed to retrieve file",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}

/**
 * DELETE /api/files/[id]
 * Delete a file record
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await verifyAuth(req);

    if (!authUser) {
      return sendAuthError("Not authenticated");
    }

    const { id } = await params;
    const fileId = parseInt(id);

    if (isNaN(fileId)) {
      return sendError("Invalid file ID", "INVALID_ID", 400);
    }

    // Fetch file
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return sendError("File not found", "FILE_NOT_FOUND", 404);
    }

    // Check permissions - only owner or admin can delete
    if (authUser.role !== "ADMIN" && file.uploadedBy !== authUser.userId) {
      return sendError(
        "You don't have permission to delete this file",
        "FORBIDDEN",
        403
      );
    }

    // Delete file record (Note: This doesn't delete from S3)
    await prisma.file.delete({
      where: { id: fileId },
    });

    return sendSuccess(
      { id: fileId },
      "File record deleted successfully. Note: Physical file still exists in S3.",
      200
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("File deletion error:", error);
    return sendError(
      "Failed to delete file",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}
