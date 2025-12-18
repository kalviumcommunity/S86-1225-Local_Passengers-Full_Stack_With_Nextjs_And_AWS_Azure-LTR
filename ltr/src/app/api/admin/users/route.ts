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
import bcrypt from "bcryptjs";
import { z } from "zod";
import redis from "@/lib/redis";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Validation schema for creating a station master
const createStationMasterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  stationId: z.number().optional(),
});

/**
 * GET /api/admin/users
 * Get all station masters and their data
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

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;

    const skip = (page - 1) * limit;

    // Create cache key
    const cacheKey = `users:station-masters:page=${page}:limit=${limit}`;

    // Try to get from cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      // eslint-disable-next-line no-console
      console.log("✅ Cache Hit - Serving users from Redis");
      return sendSuccess(
        JSON.parse(cachedData),
        "Users fetched successfully (from cache)",
        200
      );
    }

    // eslint-disable-next-line no-console
    console.log("❌ Cache Miss - Fetching users from database");

    // Get only station masters with their assigned trains
    const [stationMasters, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          role: "STATION_MASTER",
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          stationId: true,
          station: {
            select: {
              id: true,
              stationCode: true,
              stationName: true,
              city: true,
            },
          },
          managedTrains: {
            select: {
              id: true,
              trainNumber: true,
              trainName: true,
              source: true,
              destination: true,
              status: true,
              delay: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.user.count({ where: { role: "STATION_MASTER" } }),
    ]);

    const responseData = {
      stationMasters,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache for 90 seconds
    await redis.set(cacheKey, JSON.stringify(responseData), "EX", 90);
    // eslint-disable-next-line no-console
    console.log("💾 Users data cached for 90 seconds");

    return sendSuccess(
      responseData,
      "Station masters fetched successfully",
      200
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("GET /api/admin/users error:", error);
    return sendError(
      "Failed to fetch station masters",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}

/**
 * POST /api/admin/users
 * Create a new station master account
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
    const validation = createStationMasterSchema.safeParse(body);
    if (!validation.success) {
      return sendValidationError(
        "Invalid input data",
        validation.error.flatten().fieldErrors
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validation.data.email },
    });

    if (existingUser) {
      return sendError(
        "User with this email already exists",
        ERROR_CODES.CONFLICT_ERROR,
        409
      );
    }

    // Verify station exists if provided
    if (validation.data.stationId) {
      const station = await prisma.station.findUnique({
        where: { id: validation.data.stationId },
      });
      if (!station) {
        return sendValidationError("Invalid station ID", {
          stationId: "Station not found",
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validation.data.password, 10);

    // Create station master
    const stationMaster = await prisma.user.create({
      data: {
        email: validation.data.email,
        password: hashedPassword,
        name: validation.data.name,
        phone: validation.data.phone,
        role: "STATION_MASTER",
        stationId: validation.data.stationId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        stationId: true,
        station: {
          select: {
            id: true,
            stationCode: true,
            stationName: true,
            city: true,
          },
        },
        createdAt: true,
      },
    });

    // Invalidate users cache
    const pattern = "users:station-masters:*";
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      // eslint-disable-next-line no-console
      console.log(`🗑️ Users cache invalidated: ${keys.length} keys deleted`);
    }

    return sendSuccess(
      { user: stationMaster },
      "Station master created successfully",
      201
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("POST /api/admin/users error:", error);
    return sendError(
      "Failed to create station master",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}
