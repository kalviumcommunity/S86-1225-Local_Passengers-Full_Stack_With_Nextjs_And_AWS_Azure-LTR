/**
 * RBAC React Components
 *
 * Reusable components for role-based UI rendering
 */

"use client";

import { ReactNode } from "react";
import { Role, Permission } from "@/config/rbac";
import {
  usePermission,
  useAnyPermission,
  useRole,
  useAnyRole,
} from "@/hooks/useRBAC";

/**
 * Props for permission-based components
 */
interface PermissionGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component that renders children only if user has specific permission
 *
 * @example
 * <HasPermission permission={Permission.DELETE_TRAIN}>
 *   <button>Delete Train</button>
 * </HasPermission>
 */
export function HasPermission({
  permission,
  children,
  fallback = null,
}: PermissionGuardProps & { permission: Permission }) {
  const hasAccess = usePermission(permission);

  return <>{hasAccess ? children : fallback}</>;
}

/**
 * Component that renders children only if user has any of the specified permissions
 *
 * @example
 * <HasAnyPermission permissions={[Permission.UPDATE_TRAIN, Permission.DELETE_TRAIN]}>
 *   <button>Manage Train</button>
 * </HasAnyPermission>
 */
export function HasAnyPermission({
  permissions,
  children,
  fallback = null,
}: PermissionGuardProps & { permissions: Permission[] }) {
  const hasAccess = useAnyPermission(permissions);

  return <>{hasAccess ? children : fallback}</>;
}

/**
 * Component that renders children only if user has specific role
 *
 * @example
 * <HasRole role={Role.ADMIN}>
 *   <AdminPanel />
 * </HasRole>
 */
export function HasRole({
  role,
  children,
  fallback = null,
}: PermissionGuardProps & { role: Role }) {
  const hasAccess = useRole(role);

  return <>{hasAccess ? children : fallback}</>;
}

/**
 * Component that renders children only if user has any of the specified roles
 *
 * @example
 * <HasAnyRole roles={[Role.ADMIN, Role.STATION_MASTER]}>
 *   <ManageTrainsButton />
 * </HasAnyRole>
 */
export function HasAnyRole({
  roles,
  children,
  fallback = null,
}: PermissionGuardProps & { roles: Role[] }) {
  const hasAccess = useAnyRole(roles);

  return <>{hasAccess ? children : fallback}</>;
}

/**
 * Component that renders children only for admin users
 *
 * @example
 * <AdminOnly>
 *   <AdminDashboard />
 * </AdminOnly>
 */
export function AdminOnly({ children, fallback = null }: PermissionGuardProps) {
  const isAdmin = useRole(Role.ADMIN);

  return <>{isAdmin ? children : fallback}</>;
}

/**
 * Component that renders children only for station masters or admins
 *
 * @example
 * <StationMasterOrAdmin>
 *   <ManageTrainsPanel />
 * </StationMasterOrAdmin>
 */
export function StationMasterOrAdmin({
  children,
  fallback = null,
}: PermissionGuardProps) {
  const hasAccess = useAnyRole([Role.ADMIN, Role.STATION_MASTER]);

  return <>{hasAccess ? children : fallback}</>;
}

/**
 * Component that shows different content based on user's role
 *
 * @example
 * <RoleSwitch
 *   admin={<AdminDashboard />}
 *   stationMaster={<StationMasterDashboard />}
 *   user={<UserDashboard />}
 *   fallback={<LoginPrompt />}
 * />
 */
export function RoleSwitch({
  admin,
  stationMaster,
  projectManager,
  teamLead,
  user,
  fallback = null,
}: {
  admin?: ReactNode;
  stationMaster?: ReactNode;
  projectManager?: ReactNode;
  teamLead?: ReactNode;
  user?: ReactNode;
  fallback?: ReactNode;
}) {
  const isAdmin = useRole(Role.ADMIN);
  const isStationMaster = useRole(Role.STATION_MASTER);
  const isProjectManager = useRole(Role.PROJECT_MANAGER);
  const isTeamLead = useRole(Role.TEAM_LEAD);
  const isUser = useRole(Role.USER);

  if (isAdmin && admin) return <>{admin}</>;
  if (isStationMaster && stationMaster) return <>{stationMaster}</>;
  if (isProjectManager && projectManager) return <>{projectManager}</>;
  if (isTeamLead && teamLead) return <>{teamLead}</>;
  if (isUser && user) return <>{user}</>;

  return <>{fallback}</>;
}

/**
 * Component that renders different content based on permission check
 *
 * @example
 * <PermissionSwitch
 *   permission={Permission.DELETE_TRAIN}
 *   granted={<button>Delete</button>}
 *   denied={<button disabled>Delete (No Permission)</button>}
 * />
 */
export function PermissionSwitch({
  permission,
  granted,
  denied = null,
}: {
  permission: Permission;
  granted: ReactNode;
  denied?: ReactNode;
}) {
  const hasAccess = usePermission(permission);

  return <>{hasAccess ? granted : denied}</>;
}
