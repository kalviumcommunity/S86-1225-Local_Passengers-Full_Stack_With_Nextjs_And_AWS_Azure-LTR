"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/hooks/useUI";

export default function ContextDemoPage() {
  const { user, isAuthenticated, login, logout, loading, isAdmin } = useAuth();
  const {
    theme,
    toggleTheme,
    isDarkMode,
    sidebarOpen,
    toggleSidebar,
    notifications,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    removeNotification,
  } = useUI();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async () => {
    try {
      setLoginError("");
      await login(email, password);
      showSuccess("Successfully logged in!");
    } catch {
      setLoginError("Login failed. Please check your credentials.");
      showError("Login failed!");
    }
  };

  const handleLogout = async () => {
    await logout();
    showInfo("You have been logged out");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <main
      className={`min-h-screen p-6 transition-colors ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`px-4 py-3 rounded shadow-lg max-w-sm ${
              notif.type === "success"
                ? "bg-green-500 text-white"
                : notif.type === "error"
                  ? "bg-red-500 text-white"
                  : notif.type === "warning"
                    ? "bg-yellow-500 text-black"
                    : "bg-blue-500 text-white"
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{notif.message}</span>
              <button
                onClick={() => removeNotification(notif.id)}
                className="ml-4 text-xl font-bold hover:opacity-70"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          🎯 Context & Hooks Demo - LocalPassengers
        </h1>

        {/* Auth Section */}
        <section className="mb-8 p-6 border rounded-lg shadow-sm bg-opacity-50">
          <h2 className="text-2xl font-semibold mb-4">
            🔐 Authentication State
          </h2>

          {isAuthenticated ? (
            <div className="space-y-3">
              <p className="text-lg">
                ✅ Logged in as: <strong>{user?.email}</strong>
              </p>
              <p>Name: {user?.name || "N/A"}</p>
              <p>Role: {user?.role || "USER"}</p>
              {isAdmin && (
                <p className="text-yellow-500 font-semibold">👑 Admin Access</p>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="mb-3">❌ Not authenticated</p>
              <div className="space-y-2 max-w-xs">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-black"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-black"
                />
                {loginError && (
                  <p className="text-red-500 text-sm">{loginError}</p>
                )}
                <button
                  onClick={handleLogin}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  Login
                </button>
              </div>
            </div>
          )}
        </section>

        {/* UI Controls Section */}
        <section className="mb-8 p-6 border rounded-lg shadow-sm bg-opacity-50">
          <h2 className="text-2xl font-semibold mb-4">🎨 UI Controls</h2>

          <div className="space-y-4">
            <div>
              <p className="mb-2">
                Current Theme: <strong>{theme}</strong>{" "}
                {isDarkMode ? "🌙" : "☀️"}
              </p>
              <button
                onClick={toggleTheme}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Toggle Theme
              </button>
            </div>

            <div>
              <p className="mb-2">
                Sidebar Status:{" "}
                <strong>{sidebarOpen ? "Open" : "Closed"}</strong>
              </p>
              <button
                onClick={toggleSidebar}
                className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition"
              >
                {sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
              </button>
            </div>
          </div>
        </section>

        {/* Notification Testing Section */}
        <section className="mb-8 p-6 border rounded-lg shadow-sm bg-opacity-50">
          <h2 className="text-2xl font-semibold mb-4">
            🔔 Notification System
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => showSuccess("Train arrived on time!")}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Success
            </button>
            <button
              onClick={() => showError("Train delayed by 15 minutes")}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Error
            </button>
            <button
              onClick={() => showInfo("Platform changed to 3")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Info
            </button>
            <button
              onClick={() =>
                showWarning("Weather conditions may affect schedule")
              }
              className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition"
            >
              Warning
            </button>
          </div>
        </section>

        {/* Context Info */}
        <section className="p-6 border rounded-lg shadow-sm bg-opacity-50">
          <h2 className="text-2xl font-semibold mb-4">
            📊 Context State Overview
          </h2>
          <div className="space-y-2 font-mono text-sm">
            <p>✓ AuthContext: {isAuthenticated ? "Active" : "Inactive"}</p>
            <p>✓ UIContext: Active</p>
            <p>✓ Custom Hooks: useAuth, useUI</p>
            <p>✓ Global State: Shared across all components</p>
          </div>
        </section>
      </div>
    </main>
  );
}
