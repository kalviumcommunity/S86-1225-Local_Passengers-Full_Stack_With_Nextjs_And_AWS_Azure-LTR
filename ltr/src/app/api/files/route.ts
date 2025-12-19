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
 * POST /api/files
 * Store file metadata in the database after successful upload
 */
export async function POST(req: NextRequest) {
  try {
    const authUser = await verifyAuth(req);

    if (!authUser) {
      return sendAuthError("Not authenticated");
    }

    // Parse request body
    const body = await req.json();
    const { fileName, fileUrl, fileType, fileSize, isPublic } = body;

    // Validation
    if (!fileName || !fileUrl || !fileType || !fileSize) {
      return sendError(
        "fileName, fileUrl, fileType, and fileSize are required",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    // Create file record in database
    const file = await prisma.file.create({
      data: {
        fileName,
        fileUrl,
        fileType,
        fileSize: parseInt(fileSize),
        uploadedBy: authUser.userId,
        isPublic: isPublic || false,
      },
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

    return sendSuccess(file, "File metadata saved successfully", 201);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("File storage error:", error);
    return sendError(
      "Failed to store file metadata",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}

/**
 * GET /api/files
 * Retrieve all files uploaded by the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const authUser = await verifyAuth(req);

    if (!authUser) {
      return sendAuthError("Not authenticated");
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const fileType = searchParams.get("fileType");

    // Build where clause
    const whereClause: { uploadedBy?: number; fileType?: { contains: string } } =
      {};

    // Admin can see all files, users see only their own
    if (authUser.role !== "ADMIN") {
      whereClause.uploadedBy = authUser.userId;
    }

    // Filter by file type if provided
    if (fileType) {
      whereClause.fileType = { contains: fileType };
    }

    // Fetch files with pagination
    const [files, total] = await Promise.all([
      prisma.file.findMany({
        where: whereClause,
        include: {
          uploader: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.file.count({ where: whereClause }),
    ]);

    return sendSuccess(
      {
        files,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
      "Files retrieved successfully",
      200
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("File retrieval error:", error);
    return sendError(
      "Failed to retrieve files",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}
