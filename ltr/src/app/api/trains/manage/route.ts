/**
 * POST /api/trains/manage
 * Create or update train information
 *
 * Access: ADMIN or STATION_MASTER only
 * Permissions: CREATE_TRAIN, UPDATE_TRAIN
 *
 * This endpoint demonstrates RBAC enforcement:
 * - Permission checks before operations
 * - Audit logging of access attempts
 * - Role-based business logic
 */

import { NextRequest, NextResponse } from "next/server";
import { Permission } from "@/config/rbac";
import { requireAnyPermission } from "@/lib/rbacMiddleware";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  // Check permissions - user must have either CREATE_TRAIN or UPDATE_TRAIN
  const permissionError = requireAnyPermission(
    req,
    [Permission.CREATE_TRAIN, Permission.UPDATE_TRAIN],
    "train",
    "manage trains"
  );

  if (permissionError) return permissionError;

  try {
    const user = getAuthenticatedUser(req);
    const body = await req.json();
    const { trainNumber, action } = body;

    if (action === "create") {
      // Check CREATE_TRAIN permission specifically
      const createError = requireAnyPermission(
        req,
        [Permission.CREATE_TRAIN],
        "train",
        "create train"
      );
      if (createError) return createError;

      // Create train logic here
      // const train = await prisma.train.create({ data: { ... } });

      return NextResponse.json({
        success: true,
        message: `Train ${trainNumber} created successfully by ${user?.email}`,
        action: "create",
      });
    } else if (action === "update") {
      // Check UPDATE_TRAIN permission specifically
      const updateError = requireAnyPermission(
        req,
        [Permission.UPDATE_TRAIN],
        "train",
        "update train"
      );
      if (updateError) return updateError;

      // Update train logic here
      // const train = await prisma.train.update({ where: { ... }, data: { ... } });

      return NextResponse.json({
        success: true,
        message: `Train ${trainNumber} updated successfully by ${user?.email}`,
        action: "update",
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Invalid action. Use "create" or "update"',
      },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to manage train",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/trains/manage
 * Delete train information
 *
 * Access: ADMIN or STATION_MASTER only
 * Permission: DELETE_TRAIN
 */
export async function DELETE(req: NextRequest) {
  // Check DELETE_TRAIN permission
  const permissionError = requireAnyPermission(
    req,
    [Permission.DELETE_TRAIN],
    "train",
    "delete train"
  );

  if (permissionError) return permissionError;

  try {
    const user = getAuthenticatedUser(req);
    const { searchParams } = new URL(req.url);
    const trainId = searchParams.get("trainId");

    if (!trainId) {
      return NextResponse.json(
        {
          success: false,
          message: "Train ID is required",
        },
        { status: 400 }
      );
    }

    // Delete train logic here
    // await prisma.train.delete({ where: { id: trainId } });

    return NextResponse.json({
      success: true,
      message: `Train ${trainId} deleted successfully by ${user?.email}`,
      action: "delete",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete train",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
