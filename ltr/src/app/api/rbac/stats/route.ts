/**
 * GET /api/rbac/stats
 * Get RBAC statistics
 *
 * Access: ADMIN only
 *
 * Returns statistics about RBAC decisions
 */

import { NextRequest, NextResponse } from "next/server";
import { Role } from "@/config/rbac";
import { requireRole } from "@/lib/rbacMiddleware";
import { getRBACStats } from "@/lib/rbac";

export async function GET(req: NextRequest) {
  // Check if user is admin
  const error = requireRole(
    req,
    Role.ADMIN,
    "rbac-stats",
    "view RBAC statistics"
  );
  if (error) return error;

  const stats = getRBACStats();

  return NextResponse.json({
    success: true,
    stats,
  });
}
