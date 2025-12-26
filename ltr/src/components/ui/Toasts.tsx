"use client";
import React from "react";
import { useUIContext } from "@/context/UIContext";

export default function Toasts() {
  const { notifications, removeNotification } = useUIContext();

  return (
    <div
      aria-live="polite"
      className="fixed z-50 right-4 bottom-4 flex flex-col gap-2"
    >
      {notifications.map((n) => (
        <div
          key={n.id}
          role="status"
          className={`max-w-sm w-full px-4 py-3 rounded shadow-lg border flex items-start gap-3 transition-opacity bg-white border-gray-200 ${
            n.type === "success"
              ? "ring-2 ring-green-200"
              : n.type === "error"
                ? "ring-2 ring-red-200"
                : n.type === "warning"
                  ? "ring-2 ring-yellow-200"
                  : "ring-2 ring-blue-100"
          }`}
        >
          <div className="flex-1">
            <p className="font-medium text-sm text-gray-800">{n.message}</p>
          </div>
          <button
            aria-label="Dismiss"
            onClick={() => removeNotification(n.id)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
