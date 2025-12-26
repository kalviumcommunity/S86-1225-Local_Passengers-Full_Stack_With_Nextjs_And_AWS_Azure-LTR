/**
 * GET /api/rbac/audit-log
 * Get RBAC audit log entries
 *
 * Access: ADMIN only
 *
 * Query params:
 * - limit: Number of entries to return (default: 100)
 * - userId: Filter by user ID (optional)
 * - denied: Show only denied attempts (optional)
 */

import { NextRequest, NextResponse } from "next/server";
import { Role } from "@/config/rbac";
import { requireRole } from "@/lib/rbacMiddleware";
import { getAuditLog, getUserAuditLog, getDeniedAttempts } from "@/lib/rbac";

export async function GET(req: NextRequest) {
  // Check if user is admin
  const error = requireRole(req, Role.ADMIN, "audit-log", "view audit logs");
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "100");
  const userId = searchParams.get("userId");
  const deniedOnly = searchParams.get("denied") === "true";

  let logs;

  if (userId) {
    logs = getUserAuditLog(parseInt(userId), limit);
  } else if (deniedOnly) {
    logs = getDeniedAttempts(limit);
  } else {
    logs = getAuditLog(limit);
  }

  return NextResponse.json({
    success: true,
    count: logs.length,
    logs,
  });
}
