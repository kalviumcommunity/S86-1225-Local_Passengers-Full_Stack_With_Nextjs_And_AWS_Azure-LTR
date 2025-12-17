import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createRerouteSchema } from "@/lib/schemas";
import { ZodError } from "zod";

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
 * POST /api/reroutes
 * Generate reroute suggestions
 * Access: Authenticated User
 */
export async function POST(req: NextRequest) {
  try {
    const authUser = await verifyAuth(req);

    if (!authUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();

    // Validate input using Zod schema
    const validatedData = createRerouteSchema.parse(body);
    const { trainId, source, destination, reason } = validatedData;

    // TODO: Implement actual reroute algorithm
    // This would typically involve:
    // 1. Fetching current train route
    // 2. Analyzing alternative routes
    // 3. Computing optimal reroute based on delays/cancellations
    // 4. Returning reroute suggestions

    // Mock reroute suggestions
    const rerouteSuggestions = {
      trainId,
      originalRoute: {
        source,
        destination,
        estimatedTime: "10 hours",
      },
      reason,
      suggestions: [
        {
          id: 1,
          route: `${source} → Via Junction A → ${destination}`,
          estimatedTime: "11 hours",
          delay: "1 hour",
          confidence: "High",
        },
        {
          id: 2,
          route: `${source} → Via Junction B → ${destination}`,
          estimatedTime: "12 hours",
          delay: "2 hours",
          confidence: "Medium",
        },
      ],
      generatedAt: new Date().toISOString(),
      userId: authUser.userId,
    };

    return NextResponse.json(
      { message: "Reroute suggestions generated", data: rerouteSuggestions },
      { status: 201 }
    );
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    // eslint-disable-next-line no-console
    console.error("Generate reroute error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
