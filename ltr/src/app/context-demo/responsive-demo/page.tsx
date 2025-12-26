"use client";
import React from "react";
import { useUIContext } from "@/context/UIContext";

export default function ResponsiveDemoPage() {
  const { theme, toggleTheme } = useUIContext();

  return (
    <main className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white">
            Responsive & Theme Demo
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="px-3 py-2 rounded bg-brand text-white"
            >
              Toggle {theme === "light" ? "Dark" : "Light"}
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
              Card 1
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Responsive content flows and scales.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
              Card 2
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Breakpoints: sm, md, lg, xl.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
              Card 3
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Theme-aware colors and spacing.
            </p>
          </div>
        </section>

        <footer className="mt-6 text-sm text-gray-600 dark:text-gray-300">
          Resize the viewport or use Device Toolbar to test
          mobile/tablet/desktop.
        </footer>
      </div>
    </main>
  );
}
