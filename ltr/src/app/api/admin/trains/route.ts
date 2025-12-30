import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendSuccess,
  sendError,
  sendAuthError,
  sendForbiddenError,
  sendValidationError,
} from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import jwt from "jsonwebtoken";
import { z } from "zod";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Validation schema for creating a train
const createTrainSchema = z.object({
  trainNumber: z.string().min(1, "Train number is required"),
  trainName: z.string().min(1, "Train name is required"),
  source: z.string().min(1, "Source is required"),
  destination: z.string().min(1, "Destination is required"),
  departureTime: z.string().min(1, "Departure time is required"),
  arrivalTime: z.string().min(1, "Arrival time is required"),
  status: z.string().optional(),
  platform: z.string().optional(),
  delay: z.number().min(0).optional(),
  assignedStationId: z.number().optional(),
  stationMasterId: z.number().optional(),
});

/**
 * GET /api/admin/trains
 * Get all trains (admin view)
 * Access: Admin only
 */
export async function GET(req: NextRequest) {
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

    // Get query parameters for filtering
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const stationId = searchParams.get("stationId");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: { assignedStationId?: number } = {};
    if (stationId) {
      where.assignedStationId = parseInt(stationId);
    }

    // Get trains
    const [trains, total] = await Promise.all([
      prisma.train.findMany({
        where,
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
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.train.count({ where }),
    ]);

    return sendSuccess(
      {
        trains,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Trains fetched successfully",
      200
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("GET /api/admin/trains error:", error);
    return sendError(
      "Failed to fetch trains",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}

/**
 * POST /api/admin/trains
 * Create a new train
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
    const validation = createTrainSchema.safeParse(body);
    if (!validation.success) {
      return sendValidationError(
        "Invalid input data",
        validation.error.flatten().fieldErrors
      );
    }

    // Check if train number already exists
    const existingTrain = await prisma.train.findUnique({
      where: { trainNumber: validation.data.trainNumber },
    });

    if (existingTrain) {
      return sendError(
        "Train with this number already exists",
        ERROR_CODES.CONFLICT,
        409
      );
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

    // Create train
    const train = await prisma.train.create({
      data: {
        ...validation.data,
        delay: validation.data.delay || 0,
        status: validation.data.status || "On Time",
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

    return sendSuccess({ train }, "Train created successfully", 201);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("POST /api/admin/trains error:", error);
    return sendError(
      "Failed to create train",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}
