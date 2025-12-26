/**
 * RBAC React Hooks
 *
 * Custom hooks for checking permissions and roles in React components
 */

"use client";

import { useAuth } from "./useAuth";
import { Role, Permission } from "@/config/rbac";
import { hasPermission, hasAnyPermission, hasAllPermissions } from "@/lib/rbac";

/**
 * Hook to check if current user has a specific permission
 *
 * @param permission - Permission to check
 * @returns true if user has permission
 */
export function usePermission(permission: Permission): boolean {
  const { user } = useAuth();

  if (!user || !user.role) return false;

  return hasPermission(user.role as Role, permission);
}

/**
 * Hook to check if current user has any of the specified permissions
 *
 * @param permissions - Array of permissions to check
 * @returns true if user has at least one permission
 */
export function useAnyPermission(permissions: Permission[]): boolean {
  const { user } = useAuth();

  if (!user || !user.role) return false;

  return hasAnyPermission(user.role as Role, permissions);
}

/**
 * Hook to check if current user has all of the specified permissions
 *
 * @param permissions - Array of permissions to check
 * @returns true if user has all permissions
 */
export function useAllPermissions(permissions: Permission[]): boolean {
  const { user } = useAuth();

  if (!user || !user.role) return false;

  return hasAllPermissions(user.role as Role, permissions);
}

/**
 * Hook to check if current user has a specific role
 *
 * @param role - Role to check
 * @returns true if user has the role
 */
export function useRole(role: Role): boolean {
  const { user } = useAuth();

  return user?.role === role;
}

/**
 * Hook to check if current user has any of the specified roles
 *
 * @param roles - Array of roles to check
 * @returns true if user has any of the roles
 */
export function useAnyRole(roles: Role[]): boolean {
  const { user } = useAuth();

  if (!user || !user.role) return false;

  return roles.includes(user.role as Role);
}

/**
 * Hook to check if current user is an admin
 *
 * @returns true if user is admin
 */
export function useIsAdmin(): boolean {
  return useRole(Role.ADMIN);
}

/**
 * Hook to check if current user is a station master
 *
 * @returns true if user is station master
 */
export function useIsStationMaster(): boolean {
  return useRole(Role.STATION_MASTER);
}

/**
 * Hook to get current user's role
 *
 * @returns User's role or null
 */
export function useUserRole(): Role | null {
  const { user } = useAuth();

  return (user?.role as Role) || null;
}

/**
 * Hook to check if user can perform CRUD operations
 *
 * @param resource - Resource type (e.g., 'train', 'alert')
 * @returns Object with create, read, update, delete boolean flags
 */
export function useCRUDPermissions(resource: string): {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
} {
  const { user } = useAuth();

  if (!user || !user.role) {
    return {
      canCreate: false,
      canRead: false,
      canUpdate: false,
      canDelete: false,
    };
  }

  const role = user.role as Role;

  // Map resource to permissions
  const createPerm = `create:${resource}` as Permission;
  const readPerm = `read:${resource}` as Permission;
  const updatePerm = `update:${resource}` as Permission;
  const deletePerm = `delete:${resource}` as Permission;

  return {
    canCreate: hasPermission(role, createPerm),
    canRead: hasPermission(role, readPerm),
    canUpdate: hasPermission(role, updatePerm),
    canDelete: hasPermission(role, deletePerm),
  };
}
