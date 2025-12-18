import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendSuccess,
  sendError,
  sendAuthError,
  sendForbiddenError,
  sendNotFoundError,
  sendValidationError,
} from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import jwt from "jsonwebtoken";
import { z } from "zod";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Validation schema for updating train status
const updateTrainStatusSchema = z.object({
  status: z.string().optional(),
  platform: z.string().optional(),
  delay: z.number().min(0).optional(),
  departureTime: z.string().optional(),
  arrivalTime: z.string().optional(),
});

/**
 * PUT /api/station-master/trains/:id
 * Update train status (delay, platform, time) for assigned trains only
 * Access: Station Master only
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trainId = parseInt(id);

    if (isNaN(trainId)) {
      return sendValidationError("Invalid train ID", {
        id: "Invalid train ID",
      });
    }

    // Get token
    const token =
      req.cookies.get("token")?.value ||
      req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return sendAuthError("No token provided");
    }

    // Verify token
    let decoded: { userId: number; email: string; role: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        email: string;
        role: string;
      };
    } catch {
      return sendAuthError("Invalid or expired token");
    }

    // Check if user is Station Master
    if (decoded.role !== "STATION_MASTER") {
      return sendForbiddenError("Access denied. Station Master role required.");
    }

    // Get request body
    const body = await req.json();

    // Validate input
    const validation = updateTrainStatusSchema.safeParse(body);
    if (!validation.success) {
      return sendValidationError(
        "Invalid input data",
        validation.error.flatten().fieldErrors
      );
    }

    // Check if train exists and is assigned to this station master
    const train = await prisma.train.findUnique({
      where: { id: trainId },
    });

    if (!train) {
      return sendNotFoundError("Train not found");
    }

    if (train.stationMasterId !== decoded.userId) {
      return sendForbiddenError(
        "Access denied. This train is not assigned to you."
      );
    }

    // Update train
    const updatedTrain = await prisma.train.update({
      where: { id: trainId },
      data: {
        ...validation.data,
        updatedAt: new Date(),
      },
      include: {
        assignedStation: {
          select: {
            id: true,
            stationCode: true,
            stationName: true,
            city: true,
          },
        },
      },
    });

    return sendSuccess(
      { train: updatedTrain },
      "Train status updated successfully",
      200
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("PUT /api/station-master/trains/[id] error:", error);
    return sendError(
      "Failed to update train",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}
