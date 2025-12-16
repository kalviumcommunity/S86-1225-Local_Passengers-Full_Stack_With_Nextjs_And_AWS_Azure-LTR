import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/trains
 * Get list of trains
 * Access: Public / Authenticated User
 * Data fetched from external API
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const source = searchParams.get("source");
    const destination = searchParams.get("destination");

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

    return NextResponse.json(
      {
        trains: paginatedTrains,
        pagination: {
          page,
          limit,
          total: mockTrains.length,
          totalPages: Math.ceil(mockTrains.length / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Get trains error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
