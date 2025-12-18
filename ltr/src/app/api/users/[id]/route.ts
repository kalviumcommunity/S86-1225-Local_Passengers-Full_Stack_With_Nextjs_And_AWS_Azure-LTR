import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { userUpdateSchema } from "@/lib/schemas";
import { ZodError } from "zod";
import { handleError } from "@/lib/errorHandler";

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
 * GET /api/users/:id
 * Get user profile
 * Access: Authenticated User (self only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);
    const authUser = await verifyAuth(request);

    if (!authUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Check if user is accessing their own profile
    if (authUser.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only access your own profile" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: unknown) {
    return handleError(error, "GET /api/users/[id]");
  }
}

/**
 * PUT /api/users/:id
 * Update user profile
 * Access: Authenticated User (self only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);
    const authUser = await verifyAuth(request);

    if (!authUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Check if user is updating their own profile
    if (authUser.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only update your own profile" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate input using Zod schema
    const validatedData = userUpdateSchema.parse(body);
    const { name, phone, profilePicture, role } = validatedData;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Build update data
    const updateData: Record<string, string> = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (profilePicture !== undefined)
      updateData.profilePicture = profilePicture;
    if (role !== undefined) updateData.role = role;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error: unknown) {
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
    if ((error as { code?: string }).code === "P2002") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    return handleError(error, "PUT /api/users/[id]");
  }
}

/**
 * DELETE /api/users/:id
 * Delete user account
 * Access: Authenticated User (self only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);
    const authUser = await verifyAuth(request);

    if (!authUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Check if user is deleting their own account
    if (authUser.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own account" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    // Clear token cookie
    const response = NextResponse.json(
      { message: "User account deleted successfully" },
      { status: 200 }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    });

    return response;
  } catch (error: unknown) {
    if ((error as { code?: string }).code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return handleError(error, "DELETE /api/users/[id]");
  }
}
