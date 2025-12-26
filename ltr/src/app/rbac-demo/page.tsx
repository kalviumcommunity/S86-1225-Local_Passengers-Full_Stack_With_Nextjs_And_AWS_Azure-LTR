/**
 * RBAC Demo Page
 *
 * Demonstrates role-based access control with UI components
 * Shows different content based on user's role and permissions
 */

"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUserRole, useCRUDPermissions, useIsAdmin } from "@/hooks/useRBAC";
import {
  HasPermission,
  AdminOnly,
  StationMasterOrAdmin,
  RoleSwitch,
} from "@/components/RBACComponents";
import { Role, Permission } from "@/config/rbac";

export default function RBACDemoPage() {
  const { user } = useAuth();
  const userRole = useUserRole();
  const isAdmin = useIsAdmin();
  const trainPermissions = useCRUDPermissions("train");

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">RBAC Demo</h1>
        <p>Please login to see role-based content.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Role-Based Access Control Demo
      </h1>

      {/* User Info */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Current User</h2>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {userRole}
        </p>
        <p>
          <strong>Is Admin:</strong> {isAdmin ? "Yes" : "No"}
        </p>
      </div>

      {/* Permission-Based Rendering */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-3">
          Your Permissions (Train Management)
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Create Trains:</strong>{" "}
            {trainPermissions.canCreate ? "✅ Yes" : "❌ No"}
          </div>
          <div>
            <strong>Read Trains:</strong>{" "}
            {trainPermissions.canRead ? "✅ Yes" : "❌ No"}
          </div>
          <div>
            <strong>Update Trains:</strong>{" "}
            {trainPermissions.canUpdate ? "✅ Yes" : "❌ No"}
          </div>
          <div>
            <strong>Delete Trains:</strong>{" "}
            {trainPermissions.canDelete ? "✅ Yes" : "❌ No"}
          </div>
        </div>
      </div>

      {/* Conditional Rendering Examples */}
      <div className="space-y-6">
        {/* Admin Only Section */}
        <AdminOnly>
          <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-red-700">
              🔴 Admin Only Section
            </h2>
            <p>Only administrators can see this content.</p>
            <button className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Admin Dashboard
            </button>
          </div>
        </AdminOnly>

        {/* Station Master or Admin Section */}
        <StationMasterOrAdmin>
          <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-yellow-700">
              🟡 Station Master / Admin Section
            </h2>
            <p>Station Masters and Admins can see this content.</p>
            <button className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
              Manage Trains
            </button>
          </div>
        </StationMasterOrAdmin>

        {/* Permission-Based Buttons */}
        <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-green-700">
            🟢 Permission-Based Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <HasPermission permission={Permission.CREATE_TRAIN}>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                ➕ Create Train
              </button>
            </HasPermission>

            <HasPermission permission={Permission.UPDATE_TRAIN}>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                ✏️ Edit Train
              </button>
            </HasPermission>

            <HasPermission permission={Permission.DELETE_TRAIN}>
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                🗑️ Delete Train
              </button>
            </HasPermission>

            <HasPermission permission={Permission.CREATE_ALERT}>
              <button className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">
                🚨 Create Alert
              </button>
            </HasPermission>

            {/* Always show read button if user can read trains */}
            <HasPermission permission={Permission.READ_TRAIN}>
              <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                👁️ View Trains
              </button>
            </HasPermission>
          </div>
        </div>

        {/* Role-Based Switch */}
        <div className="bg-purple-50 border-2 border-purple-200 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-purple-700">
            🟣 Role-Specific Content
          </h2>
          <RoleSwitch
            admin={
              <div className="p-4 bg-red-100 rounded">
                <h3 className="font-bold">Admin Dashboard</h3>
                <p>Full system access - manage all resources</p>
              </div>
            }
            stationMaster={
              <div className="p-4 bg-yellow-100 rounded">
                <h3 className="font-bold">Station Master Dashboard</h3>
                <p>Manage trains at your assigned station</p>
              </div>
            }
            projectManager={
              <div className="p-4 bg-blue-100 rounded">
                <h3 className="font-bold">Project Manager Dashboard</h3>
                <p>Coordinate teams and oversee projects</p>
              </div>
            }
            teamLead={
              <div className="p-4 bg-green-100 rounded">
                <h3 className="font-bold">Team Lead Dashboard</h3>
                <p>Manage your team activities</p>
              </div>
            }
            user={
              <div className="p-4 bg-gray-100 rounded">
                <h3 className="font-bold">User Dashboard</h3>
                <p>View train schedules and receive alerts</p>
              </div>
            }
          />
        </div>

        {/* Multi-Role Access */}
        <div className="bg-indigo-50 border-2 border-indigo-200 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-indigo-700">
            🔵 Multi-Role Access
          </h2>
          {(userRole === Role.ADMIN ||
            userRole === Role.STATION_MASTER ||
            userRole === Role.PROJECT_MANAGER) && (
            <div className="p-4 bg-indigo-100 rounded">
              <p>
                This content is visible to Admin, Station Master, or Project
                Manager
              </p>
              <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Access Management Features
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
