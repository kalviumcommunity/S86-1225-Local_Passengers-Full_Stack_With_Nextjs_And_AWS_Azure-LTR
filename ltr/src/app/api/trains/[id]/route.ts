import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/trains/:trainId
 * Get live train status
 * Access: Public / Authenticated User
 * Real-time info from external API
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trainId = id;

    if (!trainId) {
      return NextResponse.json(
        { error: "Train ID is required" },
        { status: 400 }
      );
    }

    // TODO: Replace with actual external API call
    // Example: Railway Live Status API
    // const response = await fetch(`https://api.example.com/trains/${trainId}/status`);
    // const trainStatus = await response.json();

    // Mock data for now
    const mockTrainStatus = {
      trainId,
      trainName: "Express Train",
      source: "Mumbai Central",
      destination: "Delhi Junction",
      departureTime: "10:00 AM",
      arrivalTime: "8:00 PM",
      currentStatus: "Running",
      currentLocation: "Vadodara Junction",
      delay: 15, // minutes
      lastUpdated: new Date().toISOString(),
      expectedArrival: "8:15 PM",
      stops: [
        {
          station: "Mumbai Central",
          arrival: "10:00 AM",
          departure: "10:00 AM",
          status: "Departed",
        },
        {
          station: "Surat",
          arrival: "1:30 PM",
          departure: "1:35 PM",
          status: "Departed",
        },
        {
          station: "Vadodara",
          arrival: "3:00 PM",
          departure: "3:05 PM",
          status: "Current",
        },
        {
          station: "Ahmedabad",
          arrival: "5:00 PM",
          departure: "5:05 PM",
          status: "Upcoming",
        },
        {
          station: "Delhi Junction",
          arrival: "8:15 PM",
          departure: "8:15 PM",
          status: "Upcoming",
        },
      ],
    };

    return NextResponse.json({ train: mockTrainStatus }, { status: 200 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Get train status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
