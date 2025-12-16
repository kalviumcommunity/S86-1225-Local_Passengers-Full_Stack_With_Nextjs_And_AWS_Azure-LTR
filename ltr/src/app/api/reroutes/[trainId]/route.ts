import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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
 * GET /api/reroutes/:trainId
 * Get reroute suggestions for a specific train
 * Access: Authenticated User
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ trainId: string }> }
) {
  try {
    const authUser = await verifyAuth(req);

    if (!authUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { trainId } = await params;

    if (!trainId) {
      return NextResponse.json(
        { error: "Train ID is required" },
        { status: 400 }
      );
    }

    // TODO: Fetch previously computed reroute suggestions from database
    // For now, return mock data

    const mockRerouteSuggestions = {
      trainId,
      originalRoute: {
        source: "Mumbai Central",
        destination: "Delhi Junction",
        estimatedTime: "10 hours",
      },
      reason: "Track maintenance",
      suggestions: [
        {
          id: 1,
          route: "Mumbai Central → Via Vadodara → Delhi Junction",
          estimatedTime: "11 hours",
          delay: "1 hour",
          confidence: "High",
        },
        {
          id: 2,
          route: "Mumbai Central → Via Ahmedabad → Delhi Junction",
          estimatedTime: "12 hours",
          delay: "2 hours",
          confidence: "Medium",
        },
      ],
      generatedAt: new Date().toISOString(),
      userId: authUser.userId,
    };

    return NextResponse.json({ data: mockRerouteSuggestions }, { status: 200 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Get reroute suggestions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
