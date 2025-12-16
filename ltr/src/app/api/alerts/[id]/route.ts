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
 * DELETE /api/alerts/:id
 * Remove saved train alert
 * Access: Authenticated User
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await verifyAuth(req);

    if (!authUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const alertId = Number(id);

    if (isNaN(alertId)) {
      return NextResponse.json({ error: "Invalid alert ID" }, { status: 400 });
    }

    // Check if alert exists and belongs to user
    const alert = await prisma.alert.findUnique({
      where: { id: alertId },
    });

    if (!alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    if (alert.userId !== authUser.userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own alerts" },
        { status: 403 }
      );
    }

    // Delete alert
    await prisma.alert.delete({
      where: { id: alertId },
    });

    return NextResponse.json(
      { message: "Alert deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Delete alert error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
