"use client";
import React from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h2 className="text-xl font-semibold text-red-600 mb-2">
        Oops! Something went wrong.
      </h2>
      <p className="text-gray-600 mb-4">
        {error?.message || "An unexpected error occurred."}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
        <a href="/context-demo/users" className="px-4 py-2 border rounded">
          Open Users
        </a>
      </div>
    </div>
  );
}
