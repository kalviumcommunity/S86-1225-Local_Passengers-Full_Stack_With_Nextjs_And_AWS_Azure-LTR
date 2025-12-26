/**
 * RBAC Utility Functions
 *
 * Provides helper functions for checking permissions and enforcing
 * role-based access control throughout the application.
 */

import { Role, Permission, rolePermissions } from "@/config/rbac";

/**
 * RBAC Audit Log Entry
 */
interface RBACLogEntry {
  timestamp: Date;
  userId: number;
  email: string;
  role: Role;
  resource: string;
  action: string;
  permission: Permission;
  allowed: boolean;
  reason?: string;
}

/**
 * In-memory audit log (in production, use database or logging service)
 */
const auditLog: RBACLogEntry[] = [];

/**
 * Check if a role has a specific permission
 *
 * @param role - User's role
 * @param permission - Permission to check
 * @returns true if role has permission, false otherwise
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = rolePermissions[role] || [];
  return permissions.includes(permission);
}

/**
 * Check if a role has any of the specified permissions
 *
 * @param role - User's role
 * @param permissions - Array of permissions to check
 * @returns true if role has at least one permission
 */
export function hasAnyPermission(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if a role has all of the specified permissions
 *
 * @param role - User's role
 * @param permissions - Array of permissions to check
 * @returns true if role has all permissions
 */
export function hasAllPermissions(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 *
 * @param role - User's role
 * @returns Array of permissions
 */
export function getRolePermissions(role: Role): Permission[] {
  return rolePermissions[role] || [];
}

/**
 * Log RBAC decision for audit trail
 *
 * @param entry - Audit log entry
 */
export function logRBACDecision(entry: Omit<RBACLogEntry, "timestamp">): void {
  const logEntry: RBACLogEntry = {
    ...entry,
    timestamp: new Date(),
  };

  auditLog.push(logEntry);

  // Log to console for development (remove in production)
  const emoji = logEntry.allowed ? "✅" : "❌";
  const action = logEntry.allowed ? "ALLOWED" : "DENIED";

  // eslint-disable-next-line no-console
  console.log(
    `[RBAC ${emoji}] ${action} | User: ${logEntry.email} (${logEntry.role}) | ` +
      `Resource: ${logEntry.resource} | Action: ${logEntry.action} | ` +
      `Permission: ${logEntry.permission}${logEntry.reason ? ` | Reason: ${logEntry.reason}` : ""}`
  );
}

/**
 * Get audit log entries
 *
 * @param limit - Maximum number of entries to return
 * @returns Array of audit log entries
 */
export function getAuditLog(limit = 100): RBACLogEntry[] {
  return auditLog.slice(-limit);
}

/**
 * Get audit log for specific user
 *
 * @param userId - User ID to filter by
 * @param limit - Maximum number of entries
 * @returns Array of audit log entries
 */
export function getUserAuditLog(userId: number, limit = 50): RBACLogEntry[] {
  return auditLog.filter((entry) => entry.userId === userId).slice(-limit);
}

/**
 * Get denied access attempts (for security monitoring)
 *
 * @param limit - Maximum number of entries
 * @returns Array of denied access attempts
 */
export function getDeniedAttempts(limit = 50): RBACLogEntry[] {
  return auditLog.filter((entry) => !entry.allowed).slice(-limit);
}

/**
 * Clear audit log (use with caution)
 */
export function clearAuditLog(): void {
  auditLog.length = 0;
}

/**
 * Generate RBAC summary statistics
 */
export function getRBACStats(): {
  totalDecisions: number;
  allowed: number;
  denied: number;
  byRole: Record<Role, { allowed: number; denied: number }>;
} {
  const stats = {
    totalDecisions: auditLog.length,
    allowed: 0,
    denied: 0,
    byRole: {} as Record<Role, { allowed: number; denied: number }>,
  };

  // Initialize role stats
  Object.values(Role).forEach((role) => {
    stats.byRole[role] = { allowed: 0, denied: 0 };
  });

  // Calculate stats
  auditLog.forEach((entry) => {
    if (entry.allowed) {
      stats.allowed++;
      stats.byRole[entry.role].allowed++;
    } else {
      stats.denied++;
      stats.byRole[entry.role].denied++;
    }
  });

  return stats;
}
