import { useAuthContext } from "@/context/AuthContext";

/**
 * Custom hook for authentication
 * Provides simplified access to auth state and methods
 */
export function useAuth() {
  const { user, isAuthenticated, login, logout, loading } = useAuthContext();

  return {
    user,
    isAuthenticated,
    login,
    logout,
    loading,
    isAdmin: user?.role === "ADMIN",
    isStationMaster: user?.role === "STATION_MASTER",
  };
}
