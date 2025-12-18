import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendSuccess,
  sendError,
  sendAuthError,
  sendForbiddenError,
  sendValidationError,
  sendNotFoundError,
} from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import jwt from "jsonwebtoken";
import { z } from "zod";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Validation schema for assigning train to station master
const assignTrainSchema = z.object({
  trainId: z.number().min(1, "Train ID is required"),
  stationMasterId: z.number().min(1, "Station master ID is required"),
  stationId: z.number().optional(), // Optional: also assign station
});

/**
 * POST /api/admin/assign-train
 * Assign a train to a station master
 * Access: Admin only
 */
export async function POST(req: NextRequest) {
  try {
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

    // Check if user is Admin
    if (decoded.role !== "ADMIN") {
      return sendForbiddenError("Access denied. Admin role required.");
    }

    // Get request body
    const body = await req.json();

    // Validate input
    const validation = assignTrainSchema.safeParse(body);
    if (!validation.success) {
      return sendValidationError(
        "Invalid input data",
        validation.error.flatten().fieldErrors
      );
    }

    // Check if train exists
    const train = await prisma.train.findUnique({
      where: { id: validation.data.trainId },
    });

    if (!train) {
      return sendNotFoundError("Train not found");
    }

    // Check if station master exists and has correct role
    const stationMaster = await prisma.user.findUnique({
      where: { id: validation.data.stationMasterId },
    });

    if (!stationMaster) {
      return sendNotFoundError("Station master not found");
    }

    if (stationMaster.role !== "STATION_MASTER") {
      return sendValidationError("Invalid user role", {
        stationMasterId: "User is not a station master",
      });
    }

    // Verify station exists if provided
    if (validation.data.stationId) {
      const station = await prisma.station.findUnique({
        where: { id: validation.data.stationId },
      });
      if (!station) {
        return sendNotFoundError("Station not found");
      }
    }

    // Assign train to station master
    const updateData: {
      stationMasterId: number;
      assignedStationId?: number;
      updatedAt: Date;
    } = {
      stationMasterId: validation.data.stationMasterId,
      updatedAt: new Date(),
    };

    if (validation.data.stationId) {
      updateData.assignedStationId = validation.data.stationId;
    }

    const updatedTrain = await prisma.train.update({
      where: { id: validation.data.trainId },
      data: updateData,
      include: {
        stationMaster: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
      {
        train: updatedTrain,
        message: `Train ${train.trainNumber} assigned to ${stationMaster.name}`,
      },
      "Train assigned successfully",
      200
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("POST /api/admin/assign-train error:", error);
    return sendError(
      "Failed to assign train",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}
