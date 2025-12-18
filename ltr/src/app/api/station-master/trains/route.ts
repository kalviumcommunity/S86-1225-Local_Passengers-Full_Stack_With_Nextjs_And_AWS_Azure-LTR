import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendSuccess,
  sendError,
  sendAuthError,
  sendForbiddenError,
} from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * GET /api/station-master/trains
 * Get list of trains assigned to the station master
 * Access: Station Master only
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

    // Check if user is Station Master
    if (decoded.role !== "STATION_MASTER") {
      return sendForbiddenError("Access denied. Station Master role required.");
    }

    // Get trains assigned to this station master
    const trains = await prisma.train.findMany({
      where: {
        stationMasterId: decoded.userId,
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
      orderBy: {
        departureTime: "asc",
      },
    });

    return sendSuccess(
      {
        trains,
        count: trains.length,
      },
      "Trains fetched successfully",
      200
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("GET /api/station-master/trains error:", error);
    return sendError(
      "Failed to fetch trains",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}
