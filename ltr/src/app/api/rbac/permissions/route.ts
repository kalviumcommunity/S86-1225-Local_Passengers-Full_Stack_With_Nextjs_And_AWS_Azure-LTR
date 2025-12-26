/**
 * GET /api/rbac/permissions
 * Get current user's permissions
 *
 * Access: Authenticated users
 *
 * Returns user's role and all permissions they have
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { Role } from "@/config/rbac";
import { getRolePermissions } from "@/lib/rbac";

export async function GET(req: NextRequest) {
  const user = getAuthenticatedUser(req);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Authentication required",
        errorCode: "AUTH_REQUIRED",
      },
      { status: 401 }
    );
  }

  const role = user.role as Role;
  const permissions = getRolePermissions(role);

  return NextResponse.json({
    success: true,
    user: {
      id: user.userId,
      email: user.email,
      role: user.role,
    },
    permissions,
    permissionCount: permissions.length,
  });
}
