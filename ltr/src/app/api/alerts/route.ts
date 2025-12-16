import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
 * GET /api/alerts
 * List saved trains for the user
 * Access: Authenticated User
 */
export async function GET(req: NextRequest) {
  try {
    const authUser = await verifyAuth(req);

    if (!authUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Fetch alerts from database
    const alerts = await prisma.alert.findMany({
      where: {
        userId: authUser.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ alerts }, { status: 200 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Get alerts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/alerts
 * Save a train for alerts
 * Access: Authenticated User
 */
export async function POST(req: NextRequest) {
  try {
    const authUser = await verifyAuth(req);

    if (!authUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { trainId, trainName, source, destination, alertType } = body;

    if (!trainId) {
      return NextResponse.json(
        { error: "trainId is required" },
        { status: 400 }
      );
    }

    // Save alert to database
    const alert = await prisma.alert.create({
      data: {
        userId: authUser.userId,
        trainId,
        trainName: trainName || "Unknown Train",
        source: source || "Unknown",
        destination: destination || "Unknown",
        alertType: alertType || "all",
      },
    });

    return NextResponse.json(
      { message: "Alert created successfully", alert },
      { status: 201 }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Create alert error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
