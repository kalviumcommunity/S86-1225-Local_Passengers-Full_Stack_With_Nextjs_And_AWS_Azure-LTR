/**
 * Role-Based Access Control (RBAC) Configuration
 *
 * This file defines the role hierarchy and permissions for the Local Train Passengers system.
 * RBAC ensures users only access resources and perform actions they're authorized for.
 *
 * Roles (in order of privilege):
 * 1. ADMIN - Full system access, user management, system configuration
 * 2. STATION_MASTER - Manage trains at assigned station, view all data
 * 3. PROJECT_MANAGER - Project oversight, team coordination
 * 4. TEAM_LEAD - Team management, task assignment
 * 5. USER - Basic access, view public data, receive alerts
 */

/**
 * Permission Actions
 * Define all possible actions in the system
 */
export enum Permission {
  // User Management
  CREATE_USER = "create:user",
  READ_USER = "read:user",
  UPDATE_USER = "update:user",
  DELETE_USER = "delete:user",

  // Train Management
  CREATE_TRAIN = "create:train",
  READ_TRAIN = "read:train",
  UPDATE_TRAIN = "update:train",
  DELETE_TRAIN = "delete:train",
  ASSIGN_TRAIN = "assign:train",

  // Alert Management
  CREATE_ALERT = "create:alert",
  READ_ALERT = "read:alert",
  UPDATE_ALERT = "update:alert",
  DELETE_ALERT = "delete:alert",

  // Reroute Management
  CREATE_REROUTE = "create:reroute",
  READ_REROUTE = "read:reroute",
  UPDATE_REROUTE = "update:reroute",
  DELETE_REROUTE = "delete:reroute",

  // File Management
  UPLOAD_FILE = "upload:file",
  READ_FILE = "read:file",
  DELETE_FILE = "delete:file",

  // System Administration
  MANAGE_ROLES = "manage:roles",
  VIEW_LOGS = "view:logs",
  SYSTEM_CONFIG = "system:config",
}

/**
 * User Roles
 */
export enum Role {
  ADMIN = "ADMIN",
  STATION_MASTER = "STATION_MASTER",
  PROJECT_MANAGER = "PROJECT_MANAGER",
  TEAM_LEAD = "TEAM_LEAD",
  USER = "USER",
}

/**
 * Role Permissions Mapping
 * Defines what each role is allowed to do
 */
export const rolePermissions: Record<Role, Permission[]> = {
  /**
   * ADMIN - Full system access
   * Can perform all actions in the system
   */
  [Role.ADMIN]: [
    // User Management
    Permission.CREATE_USER,
    Permission.READ_USER,
    Permission.UPDATE_USER,
    Permission.DELETE_USER,

    // Train Management
    Permission.CREATE_TRAIN,
    Permission.READ_TRAIN,
    Permission.UPDATE_TRAIN,
    Permission.DELETE_TRAIN,
    Permission.ASSIGN_TRAIN,

    // Alert Management
    Permission.CREATE_ALERT,
    Permission.READ_ALERT,
    Permission.UPDATE_ALERT,
    Permission.DELETE_ALERT,

    // Reroute Management
    Permission.CREATE_REROUTE,
    Permission.READ_REROUTE,
    Permission.UPDATE_REROUTE,
    Permission.DELETE_REROUTE,

    // File Management
    Permission.UPLOAD_FILE,
    Permission.READ_FILE,
    Permission.DELETE_FILE,

    // System Administration
    Permission.MANAGE_ROLES,
    Permission.VIEW_LOGS,
    Permission.SYSTEM_CONFIG,
  ],

  /**
   * STATION_MASTER - Train and station management
   * Can manage trains at their assigned station
   */
  [Role.STATION_MASTER]: [
    // User Management (Read only)
    Permission.READ_USER,

    // Train Management
    Permission.CREATE_TRAIN,
    Permission.READ_TRAIN,
    Permission.UPDATE_TRAIN,
    Permission.DELETE_TRAIN,

    // Alert Management
    Permission.CREATE_ALERT,
    Permission.READ_ALERT,
    Permission.UPDATE_ALERT,
    Permission.DELETE_ALERT,

    // Reroute Management
    Permission.CREATE_REROUTE,
    Permission.READ_REROUTE,
    Permission.UPDATE_REROUTE,

    // File Management
    Permission.UPLOAD_FILE,
    Permission.READ_FILE,
  ],

  /**
   * PROJECT_MANAGER - Project and team oversight
   * Can view and coordinate but limited modifications
   */
  [Role.PROJECT_MANAGER]: [
    // User Management (Read only)
    Permission.READ_USER,

    // Train Management (Read only)
    Permission.READ_TRAIN,

    // Alert Management
    Permission.READ_ALERT,
    Permission.CREATE_ALERT,

    // Reroute Management (Read only)
    Permission.READ_REROUTE,

    // File Management
    Permission.UPLOAD_FILE,
    Permission.READ_FILE,
  ],

  /**
   * TEAM_LEAD - Team management
   * Can coordinate team activities
   */
  [Role.TEAM_LEAD]: [
    // User Management (Read only)
    Permission.READ_USER,

    // Train Management (Read only)
    Permission.READ_TRAIN,

    // Alert Management (Read only)
    Permission.READ_ALERT,

    // Reroute Management (Read only)
    Permission.READ_REROUTE,

    // File Management
    Permission.UPLOAD_FILE,
    Permission.READ_FILE,
  ],

  /**
   * USER - Basic access
   * Can view public information and receive alerts
   */
  [Role.USER]: [
    // Train Management (Read only)
    Permission.READ_TRAIN,

    // Alert Management (Read only)
    Permission.READ_ALERT,

    // Reroute Management (Read only)
    Permission.READ_REROUTE,

    // File Management (Read only)
    Permission.READ_FILE,
  ],
};

/**
 * Role Hierarchy
 * Higher roles inherit permissions from lower roles
 * Index indicates privilege level (lower = more privileged)
 */
export const roleHierarchy: Role[] = [
  Role.ADMIN,
  Role.STATION_MASTER,
  Role.PROJECT_MANAGER,
  Role.TEAM_LEAD,
  Role.USER,
];

/**
 * Get role privilege level
 * Lower number = higher privilege
 */
export function getRoleLevel(role: Role): number {
  return roleHierarchy.indexOf(role);
}

/**
 * Check if roleA has higher or equal privilege than roleB
 */
export function hasHigherOrEqualPrivilege(roleA: Role, roleB: Role): boolean {
  return getRoleLevel(roleA) <= getRoleLevel(roleB);
}

/**
 * Role descriptions for documentation
 */
export const roleDescriptions: Record<Role, string> = {
  [Role.ADMIN]:
    "Full system access - can manage all resources, users, and system configuration",
  [Role.STATION_MASTER]:
    "Station management - can manage trains and alerts at assigned station",
  [Role.PROJECT_MANAGER]:
    "Project oversight - can view all data and coordinate teams",
  [Role.TEAM_LEAD]:
    "Team coordination - can manage team activities and view project data",
  [Role.USER]:
    "Basic access - can view public information and receive personalized alerts",
};
