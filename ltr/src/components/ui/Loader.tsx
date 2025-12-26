"use client";
import React from "react";

type LoaderProps = {
  size?: number;
  label?: string;
};

export default function Loader({
  size = 24,
  label = "Loading...",
}: LoaderProps) {
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-2">
      <svg
        className="animate-spin text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>

      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}
