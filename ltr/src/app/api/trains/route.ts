import { NextRequest } from "next/server";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import redis from "@/lib/redis";
import { withCors } from "@/lib/cors";

/**
 * GET /api/trains
 * Get list of trains
 * Access: Public / Authenticated User
 * Data fetched from external API (with Redis caching)
 * CORS: Configured for secure cross-origin requests
 */
export async function GET(req: NextRequest) {
  return withCors(req, async () => {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const source = searchParams.get("source");
    const destination = searchParams.get("destination");

    // Create cache key based on query parameters
    const cacheKey = `trains:list:page=${page}:limit=${limit}:source=${source || "all"}:dest=${destination || "all"}`;

    // Try to get data from cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      // eslint-disable-next-line no-console
      console.log("✅ Cache Hit - Serving from Redis");
      return sendSuccess(
        JSON.parse(cachedData),
        "Trains fetched successfully (from cache)",
        200
      );
    }

    // eslint-disable-next-line no-console
    console.log("❌ Cache Miss - Fetching from source");

    // TODO: Replace with actual external API call
    // Example: Railway API, Indian Railways API, etc.
    // const response = await fetch('https://api.example.com/trains');
    // const trains = await response.json();

    // Mock data for testing - simulating external API response
    const mockTrains = [
      {
        trainId: "12345",
        trainName: "Rajdhani Express",
        source: source || "Mumbai Central",
        destination: destination || "New Delhi",
        departureTime: "10:00 AM",
        arrivalTime: "8:00 PM",
        status: "On Time",
      },
      {
        trainId: "67890",
        trainName: "Shatabdi Express",
        source: source || "Mumbai",
        destination: destination || "Pune",
        departureTime: "2:00 PM",
        arrivalTime: "5:30 PM",
        status: "Delayed by 15 mins",
      },
      {
        trainId: "11223",
        trainName: "Duronto Express",
        source: source || "Mumbai",
        destination: destination || "Ahmedabad",
        departureTime: "6:30 AM",
        arrivalTime: "1:45 PM",
        status: "On Time",
      },
      {
        trainId: "44556",
        trainName: "Garib Rath",
        source: source || "Pune",
        destination: destination || "Bangalore",
        departureTime: "11:00 PM",
        arrivalTime: "10:30 AM",
        status: "On Time",
      },
      {
        trainId: "77889",
        trainName: "Local Passenger",
        source: source || "Mumbai CST",
        destination: destination || "Thane",
        departureTime: "9:15 AM",
        arrivalTime: "10:00 AM",
        status: "Delayed by 30 mins",
      },
    ];

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTrains = mockTrains.slice(startIndex, endIndex);

    const responseData = {
      trains: paginatedTrains,
      pagination: {
        page,
        limit,
        total: mockTrains.length,
        totalPages: Math.ceil(mockTrains.length / limit),
      },
    };

    // Cache the response for 120 seconds (2 minutes)
    await redis.set(cacheKey, JSON.stringify(responseData), "EX", 120);
    // eslint-disable-next-line no-console
    console.log("💾 Data cached for 120 seconds");

    return sendSuccess(responseData, "Trains fetched successfully", 200);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Get trains error:", error);
    return sendError(
      "Failed to fetch trains",
      ERROR_CODES.TRAIN_FETCH_FAILED,
      500,
      error
    );
  }
  });
}
}
