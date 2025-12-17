import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import {
  sendSuccess,
  sendAuthError,
  sendValidationError,
  sendError,
} from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { createAlertSchema } from "@/lib/schemas";
import { ZodError } from "zod";

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
    };
    return decoded;
  } catch {
    return null;
  }
}

/**
 * GET /api/alerts
 * List saved trains for the user
 * Access: Authenticated User
 */
export async function GET(req: NextRequest) {
  try {
    const authUser = await verifyAuth(req);

    if (!authUser) {
      return sendAuthError("Not authenticated");
    }

    // Fetch alerts from database
    const alerts = await prisma.alert.findMany({
      where: {
        userId: authUser.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return sendSuccess(alerts, "Alerts fetched successfully", 200);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Get alerts error:", error);
    return sendError(
      "Failed to fetch alerts",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}

/**
 * POST /api/alerts
 * Save a train for alerts
 * Access: Authenticated User
 */
export async function POST(req: NextRequest) {
  try {
    const authUser = await verifyAuth(req);

    if (!authUser) {
      return sendAuthError("Not authenticated");
    }

    const body = await req.json();

    // Validate input using Zod schema
    const validatedData = createAlertSchema.parse(body);
    const { trainId, trainName, source, destination, alertType } =
      validatedData;

    // Save alert to database
    const alert = await prisma.alert.create({
      data: {
        userId: authUser.userId,
        trainId,
        trainName,
        source,
        destination,
        alertType,
      },
    });

    return sendSuccess(alert, "Alert created successfully", 201);
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
    console.error("Create alert error:", error);
    return sendError(
      "Failed to create alert",
      ERROR_CODES.ALERT_CREATION_FAILED,
      500,
      error
    );
  }
}
