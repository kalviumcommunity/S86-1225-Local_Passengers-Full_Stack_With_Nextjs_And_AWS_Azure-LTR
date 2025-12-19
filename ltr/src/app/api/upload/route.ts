import { NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import jwt from "jsonwebtoken";
import {
  sendSuccess,
  sendAuthError,
  sendError,
} from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

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

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Allowed file types
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * POST /api/upload
 * Generate a pre-signed URL for direct file upload to S3
 */
export async function POST(req: NextRequest) {
  try {
    const authUser = await verifyAuth(req);

    if (!authUser) {
      return sendAuthError("Not authenticated");
    }

    // Check if AWS credentials are configured
    if (
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY ||
      !process.env.AWS_BUCKET_NAME
    ) {
      return sendError(
        "AWS S3 is not configured. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_BUCKET_NAME in environment variables.",
        "AWS_NOT_CONFIGURED",
        500
      );
    }

    // Parse request body
    const body = await req.json();
    const { fileName, fileType, fileSize } = body;

    // Validation
    if (!fileName || !fileType || !fileSize) {
      return sendError(
        "fileName, fileType, and fileSize are required",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(fileType)) {
      return sendError(
        `File type not supported. Allowed types: ${ALLOWED_TYPES.join(", ")}`,
        "INVALID_FILE_TYPE",
        400
      );
    }

    // Validate file size
    if (fileSize > MAX_FILE_SIZE) {
      return sendError(
        `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        "FILE_TOO_LARGE",
        400
      );
    }

    // Generate unique file key
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileKey = `uploads/${authUser.userId}/${timestamp}-${sanitizedFileName}`;

    // Create S3 PutObject command
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      ContentType: fileType,
    });

    // Generate pre-signed URL with 60 seconds expiry
    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 60,
    });

    // Construct the public URL for accessing the file after upload
    const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION || "ap-south-1"}.amazonaws.com/${fileKey}`;

    return sendSuccess(
      {
        uploadUrl,
        fileKey,
        publicUrl,
        expiresIn: 60,
      },
      "Pre-signed URL generated successfully",
      200
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Upload API error:", error);
    return sendError(
      "Failed to generate pre-signed URL",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error
    );
  }
}
