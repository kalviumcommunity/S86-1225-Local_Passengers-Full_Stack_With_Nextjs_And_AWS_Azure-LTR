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

// Validation schema for updating a train
const updateTrainSchema = z.object({
  trainNumber: z.string().optional(),
  trainName: z.string().optional(),
  source: z.string().optional(),
  destination: z.string().optional(),
  departureTime: z.string().optional(),
  arrivalTime: z.string().optional(),
  status: z.string().optional(),
  platform: z.string().optional(),
  delay: z.number().min(0).optional(),
  assignedStationId: z.number().nullable().optional(),
  stationMasterId: z.number().nullable().optional(),
});

/**
 * GET /api/admin/trains/:id
 * Get a specific train by ID
 * Access: Admin only
 */
export async function GET(
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

    // Check if user is Admin
    if (decoded.role !== "ADMIN") {
      return sendForbiddenError("Access denied. Admin role required.");
    }

    // Get train
    const train = await prisma.train.findUnique({
      where: { id: trainId },
      include: {
        assignedStation: {
          select: {
            id: true,
            stationCode: true,
            stationName: true,
            city: true,
          },
        },
        stationMaster: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!train) {
      return sendNotFoundError("Train not found");
    }

    return sendSuccess({ train }, "Train fetched successfully", 200);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("GET /api/admin/trains/[id] error:", error);
    return sendError(
      "Failed to fetch train",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}

/**
 * PUT /api/admin/trains/:id
 * Update any train (admin can update any train)
 * Access: Admin only
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

    // Check if user is Admin
    if (decoded.role !== "ADMIN") {
      return sendForbiddenError("Access denied. Admin role required.");
    }

    // Get request body
    const body = await req.json();

    // Validate input
    const validation = updateTrainSchema.safeParse(body);
    if (!validation.success) {
      return sendValidationError(
        "Invalid input data",
        validation.error.flatten().fieldErrors
      );
    }

    // Check if train exists
    const existingTrain = await prisma.train.findUnique({
      where: { id: trainId },
    });

    if (!existingTrain) {
      return sendNotFoundError("Train not found");
    }

    // Check if train number is being updated and if it already exists
    if (
      validation.data.trainNumber &&
      validation.data.trainNumber !== existingTrain.trainNumber
    ) {
      const duplicateTrain = await prisma.train.findUnique({
        where: { trainNumber: validation.data.trainNumber },
      });
      if (duplicateTrain) {
        return sendError(
          "Train with this number already exists",
          ERROR_CODES.CONFLICT_ERROR,
          409
        );
      }
    }

    // Verify station exists if provided
    if (validation.data.assignedStationId) {
      const station = await prisma.station.findUnique({
        where: { id: validation.data.assignedStationId },
      });
      if (!station) {
        return sendValidationError("Invalid station ID", {
          assignedStationId: "Station not found",
        });
      }
    }

    // Verify station master exists and has correct role if provided
    if (validation.data.stationMasterId) {
      const stationMaster = await prisma.user.findUnique({
        where: { id: validation.data.stationMasterId },
      });
      if (!stationMaster || stationMaster.role !== "STATION_MASTER") {
        return sendValidationError("Invalid station master ID", {
          stationMasterId: "Station master not found or invalid role",
        });
      }
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
        stationMaster: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return sendSuccess(
      { train: updatedTrain },
      "Train updated successfully",
      200
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("PUT /api/admin/trains/[id] error:", error);
    return sendError(
      "Failed to update train",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}

/**
 * DELETE /api/admin/trains/:id
 * Delete a train
 * Access: Admin only
 */
export async function DELETE(
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

    // Check if user is Admin
    if (decoded.role !== "ADMIN") {
      return sendForbiddenError("Access denied. Admin role required.");
    }

    // Check if train exists
    const train = await prisma.train.findUnique({
      where: { id: trainId },
    });

    if (!train) {
      return sendNotFoundError("Train not found");
    }

    // Delete train
    await prisma.train.delete({
      where: { id: trainId },
    });

    return sendSuccess(
      { deletedTrainId: trainId },
      "Train deleted successfully",
      200
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("DELETE /api/admin/trains/[id] error:", error);
    return sendError(
      "Failed to delete train",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}
