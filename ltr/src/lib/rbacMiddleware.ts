/**
 * RBAC Middleware for API Routes
 *
 * Provides middleware functions to protect API routes based on roles and permissions.
 * Integrates with JWT authentication and enforces RBAC policies.
 */

import { NextRequest, NextResponse } from "next/server";
import { Role, Permission } from "@/config/rbac";
import { hasPermission, logRBACDecision } from "@/lib/rbac";
import { getAuthenticatedUser } from "@/lib/auth";

/**
 * RBAC Error Response
 */
export interface RBACError {
  success: false;
  message: string;
  errorCode: string;
  required?: Permission | Permission[] | Role | Role[];
  userRole?: Role;
}

/**
 * Check if user has required permission
 * Returns NextResponse with 403 if permission denied
 *
 * @param req - NextRequest object
 * @param permission - Required permission
 * @param resource - Resource being accessed (for logging)
 * @param action - Action being performed (for logging)
 * @returns NextResponse with error or null if allowed
 */
export function requirePermission(
  req: NextRequest,
  permission: Permission,
  resource: string,
  action: string
): NextResponse | null {
  const user = getAuthenticatedUser(req);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Authentication required",
        errorCode: "AUTH_REQUIRED",
      } as RBACError,
      { status: 401 }
    );
  }

  const role = user.role as Role;
  const allowed = hasPermission(role, permission);

  // Log RBAC decision
  logRBACDecision({
    userId: user.userId,
    email: user.email,
    role,
    resource,
    action,
    permission,
    allowed,
    reason: allowed ? undefined : "Missing required permission",
  });

  if (!allowed) {
    return NextResponse.json(
      {
        success: false,
        message: `Access denied. You do not have permission to ${action}.`,
        errorCode: "PERMISSION_DENIED",
        required: permission,
        userRole: role,
      } as RBACError,
      { status: 403 }
    );
  }

  return null;
}

/**
 * Check if user has any of the required permissions
 *
 * @param req - NextRequest object
 * @param permissions - Array of acceptable permissions
 * @param resource - Resource being accessed
 * @param action - Action being performed
 * @returns NextResponse with error or null if allowed
 */
export function requireAnyPermission(
  req: NextRequest,
  permissions: Permission[],
  resource: string,
  action: string
): NextResponse | null {
  const user = getAuthenticatedUser(req);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Authentication required",
        errorCode: "AUTH_REQUIRED",
      } as RBACError,
      { status: 401 }
    );
  }

  const role = user.role as Role;
  const allowed = permissions.some((permission) =>
    hasPermission(role, permission)
  );

  // Log RBAC decision (log first checked permission)
  logRBACDecision({
    userId: user.userId,
    email: user.email,
    role,
    resource,
    action,
    permission: permissions[0],
    allowed,
    reason: allowed
      ? undefined
      : `Missing any of required permissions: ${permissions.join(", ")}`,
  });

  if (!allowed) {
    return NextResponse.json(
      {
        success: false,
        message: `Access denied. You need one of the following permissions to ${action}.`,
        errorCode: "PERMISSION_DENIED",
        required: permissions,
        userRole: role,
      } as RBACError,
      { status: 403 }
    );
  }

  return null;
}

/**
 * Check if user has required role
 *
 * @param req - NextRequest object
 * @param requiredRole - Required role
 * @param resource - Resource being accessed
 * @param action - Action being performed
 * @returns NextResponse with error or null if allowed
 */
export function requireRole(
  req: NextRequest,
  requiredRole: Role,
  resource: string,
  action: string
): NextResponse | null {
  const user = getAuthenticatedUser(req);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Authentication required",
        errorCode: "AUTH_REQUIRED",
      } as RBACError,
      { status: 401 }
    );
  }

  const role = user.role as Role;
  const allowed = role === requiredRole;

  // Log RBAC decision
  logRBACDecision({
    userId: user.userId,
    email: user.email,
    role,
    resource,
    action,
    permission: Permission.READ_USER, // Placeholder for logging
    allowed,
    reason: allowed ? undefined : `Role ${requiredRole} required`,
  });

  if (!allowed) {
    return NextResponse.json(
      {
        success: false,
        message: `Access denied. ${requiredRole} role required to ${action}.`,
        errorCode: "ROLE_REQUIRED",
        required: requiredRole,
        userRole: role,
      } as RBACError,
      { status: 403 }
    );
  }

  return null;
}

/**
 * Check if user has any of the required roles
 *
 * @param req - NextRequest object
 * @param roles - Array of acceptable roles
 * @param resource - Resource being accessed
 * @param action - Action being performed
 * @returns NextResponse with error or null if allowed
 */
export function requireAnyRole(
  req: NextRequest,
  roles: Role[],
  resource: string,
  action: string
): NextResponse | null {
  const user = getAuthenticatedUser(req);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Authentication required",
        errorCode: "AUTH_REQUIRED",
      } as RBACError,
      { status: 401 }
    );
  }

  const role = user.role as Role;
  const allowed = roles.includes(role);

  // Log RBAC decision
  logRBACDecision({
    userId: user.userId,
    email: user.email,
    role,
    resource,
    action,
    permission: Permission.READ_USER, // Placeholder for logging
    allowed,
    reason: allowed
      ? undefined
      : `One of these roles required: ${roles.join(", ")}`,
  });

  if (!allowed) {
    return NextResponse.json(
      {
        success: false,
        message: `Access denied. You need one of the following roles to ${action}: ${roles.join(", ")}`,
        errorCode: "ROLE_REQUIRED",
        required: roles,
        userRole: role,
      } as RBACError,
      { status: 403 }
    );
  }

  return null;
}

/**
 * Check if user can access their own resource or is admin
 * Common pattern for user-specific endpoints
 *
 * @param req - NextRequest object
 * @param resourceOwnerId - ID of the resource owner
 * @param resource - Resource being accessed
 * @returns NextResponse with error or null if allowed
 */
export function requireSelfOrAdmin(
  req: NextRequest,
  resourceOwnerId: number,
  resource: string
): NextResponse | null {
  const user = getAuthenticatedUser(req);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Authentication required",
        errorCode: "AUTH_REQUIRED",
      } as RBACError,
      { status: 401 }
    );
  }

  const role = user.role as Role;
  const isSelf = user.userId === resourceOwnerId;
  const isAdmin = role === Role.ADMIN;
  const allowed = isSelf || isAdmin;

  // Log RBAC decision
  logRBACDecision({
    userId: user.userId,
    email: user.email,
    role,
    resource,
    action: "access own resource",
    permission: Permission.READ_USER,
    allowed,
    reason: allowed ? undefined : "Can only access own resources unless admin",
  });

  if (!allowed) {
    return NextResponse.json(
      {
        success: false,
        message: "Access denied. You can only access your own resources.",
        errorCode: "FORBIDDEN_RESOURCE",
        userRole: role,
      } as RBACError,
      { status: 403 }
    );
  }

  return null;
}
