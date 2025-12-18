import { NextRequest } from "next/server";

/**
 * Utility to extract authenticated user information from middleware headers
 * The middleware attaches user info to request headers after JWT validation
 */
export interface AuthenticatedUser {
  userId: number;
  email: string;
  role: string;
}

/**
 * Extract user information from request headers (set by middleware)
 * @param req - NextRequest object
 * @returns AuthenticatedUser object or null if not authenticated
 */
export function getAuthenticatedUser(req: NextRequest): AuthenticatedUser | null {
  const userId = req.headers.get("x-user-id");
  const email = req.headers.get("x-user-email");
  const role = req.headers.get("x-user-role");

  if (!userId || !email || !role) {
    return null;
  }

  return {
    userId: parseInt(userId),
    email,
    role,
  };
}

/**
 * Check if the authenticated user has a specific role
 * @param req - NextRequest object
 * @param requiredRole - Role to check for
 * @returns boolean
 */
export function hasRole(req: NextRequest, requiredRole: string): boolean {
  const user = getAuthenticatedUser(req);
  return user?.role === requiredRole;
}

/**
 * Check if the authenticated user is an admin
 * @param req - NextRequest object
 * @returns boolean
 */
export function isAdmin(req: NextRequest): boolean {
  return hasRole(req, "ADMIN");
}

/**
 * Check if the authenticated user is a project manager or higher
 * @param req - NextRequest object
 * @returns boolean
 */
export function isProjectManager(req: NextRequest): boolean {
  const user = getAuthenticatedUser(req);
  return user?.role === "ADMIN" || user?.role === "PROJECT_MANAGER";
}

/**
 * Check if the authenticated user is a team lead or higher
 * @param req - NextRequest object
 * @returns boolean
 */
export function isTeamLead(req: NextRequest): boolean {
  const user = getAuthenticatedUser(req);
  return (
    user?.role === "ADMIN" ||
    user?.role === "PROJECT_MANAGER" ||
    user?.role === "TEAM_LEAD"
  );
}
