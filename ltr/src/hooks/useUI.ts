import { useUIContext } from "@/context/UIContext";

/**
 * Custom hook for UI state management
 * Provides simplified access to theme, sidebar, and notifications
 */
export function useUI() {
  const {
    theme,
    toggleTheme,
    sidebarOpen,
    toggleSidebar,
    notifications,
    addNotification,
    removeNotification,
  } = useUIContext();

  return {
    theme,
    toggleTheme,
    isDarkMode: theme === "dark",
    sidebarOpen,
    toggleSidebar,
    notifications,
    addNotification,
    removeNotification,
    // Helper methods
    showSuccess: (message: string) => addNotification(message, "success"),
    showError: (message: string) => addNotification(message, "error"),
    showInfo: (message: string) => addNotification(message, "info"),
    showWarning: (message: string) => addNotification(message, "warning"),
  };
}
