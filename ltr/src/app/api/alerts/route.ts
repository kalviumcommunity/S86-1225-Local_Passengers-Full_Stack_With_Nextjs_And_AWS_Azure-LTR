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
import { logApiError, logApiEvent } from "@/lib/logger";

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
  const start = Date.now();
  logApiEvent("info", req, "Alerts list request received");

  try {
    const authUser = await verifyAuth(req);

    if (!authUser) {
      logApiEvent("warn", req, "Alerts list unauthorized", {
        durationMs: Date.now() - start,
        status: 401,
      });
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

    logApiEvent("info", req, "Alerts list success", {
      durationMs: Date.now() - start,
      status: 200,
      count: alerts.length,
    });
    return sendSuccess(alerts, "Alerts fetched successfully", 200);
  } catch (error) {
    logApiError(req, error, "Alerts list failed", {
      durationMs: Date.now() - start,
      status: 500,
    });
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
  const start = Date.now();
  logApiEvent("info", req, "Alert create request received");

  try {
    const authUser = await verifyAuth(req);

    if (!authUser) {
      logApiEvent("warn", req, "Alert create unauthorized", {
        durationMs: Date.now() - start,
        status: 401,
      });
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

    logApiEvent("info", req, "Alert created", {
      durationMs: Date.now() - start,
      status: 201,
      alertId: alert.id,
      userId: authUser.userId,
    });
    return sendSuccess(alert, "Alert created successfully", 201);
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      logApiEvent("warn", req, "Alert create validation failed", {
        durationMs: Date.now() - start,
        status: 400,
        issues: error.issues,
      });
      return sendValidationError(
        "Validation failed",
        error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }))
      );
    }

    logApiError(req, error, "Alert create failed", {
      durationMs: Date.now() - start,
      status: 500,
    });
    return sendError(
      "Failed to create alert",
      ERROR_CODES.ALERT_CREATION_FAILED,
      500,
      error
    );
  }
}
