/**
 * API Input Sanitization Middleware
 *
 * Automatically sanitizes all incoming request data to prevent:
 * - XSS (Cross-Site Scripting)
 * - SQL Injection
 * - HTML Injection
 *
 * Apply to API routes to ensure all user input is sanitized
 */

import { NextRequest, NextResponse } from "next/server";
import {
  sanitizeHtml,
  sanitizeObject,
  containsXssPattern,
  containsSqlInjectionPattern,
  logSuspiciousInput,
} from "./sanitize";

/**
 * Sanitize request body
 * Applies sanitization to all string fields in the request body
 *
 * @param req - Next.js request object
 * @returns Sanitized request body
 */
export async function sanitizeRequestBody(
  req: NextRequest
): Promise<Record<string, unknown>> {
  try {
    const body = await req.json();
    return sanitizeObject(body);
  } catch {
    return {};
  }
}

/**
 * Sanitize query parameters
 * Applies sanitization to all query string parameters
 *
 * @param req - Next.js request object
 * @returns Sanitized query parameters
 */
export function sanitizeQueryParams(req: NextRequest): Record<string, string> {
  const url = new URL(req.url);
  const params: Record<string, string> = {};

  url.searchParams.forEach((value, key) => {
    params[key] = sanitizeHtml(value);
  });

  return params;
}

/**
 * Detect and reject malicious requests
 * Checks request body and query params for attack patterns
 *
 * @param req - Next.js request object
 * @returns Error response if malicious patterns detected, null otherwise
 */
export async function detectMaliciousRequest(
  req: NextRequest
): Promise<NextResponse | null> {
  // Check query parameters
  const url = new URL(req.url);
  for (const [key, value] of url.searchParams.entries()) {
    if (containsXssPattern(value)) {
      logSuspiciousInput(value, "XSS", `query param: ${key}`);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input detected",
          message: "Your request contains potentially malicious content.",
          errorCode: "MALICIOUS_INPUT",
        },
        { status: 400 }
      );
    }

    if (containsSqlInjectionPattern(value)) {
      logSuspiciousInput(value, "SQL_INJECTION", `query param: ${key}`);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input detected",
          message: "Your request contains potentially malicious SQL patterns.",
          errorCode: "SQL_INJECTION_ATTEMPT",
        },
        { status: 400 }
      );
    }
  }

  // Check request body
  try {
    const body = await req.json();
    const bodyString = JSON.stringify(body);

    if (containsXssPattern(bodyString)) {
      logSuspiciousInput(bodyString, "XSS", "request body");
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input detected",
          message: "Your request contains potentially malicious content.",
          errorCode: "MALICIOUS_INPUT",
        },
        { status: 400 }
      );
    }

    if (containsSqlInjectionPattern(bodyString)) {
      logSuspiciousInput(bodyString, "SQL_INJECTION", "request body");
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input detected",
          message: "Your request contains potentially malicious SQL patterns.",
          errorCode: "SQL_INJECTION_ATTEMPT",
        },
        { status: 400 }
      );
    }
  } catch {
    // Not JSON body, skip check
  }

  return null;
}

/**
 * Middleware wrapper for API routes
 * Automatically sanitizes input and detects malicious requests
 *
 * Usage:
 * ```typescript
 * export async function POST(req: NextRequest) {
 *   const sanitizationError = await withInputSanitization(req);
 *   if (sanitizationError) return sanitizationError;
 *
 *   // Proceed with sanitized request
 *   const body = await sanitizeRequestBody(req);
 *   // ... your logic
 * }
 * ```
 *
 * @param req - Next.js request object
 * @returns Error response if malicious, null if safe
 */
export async function withInputSanitization(
  req: NextRequest
): Promise<NextResponse | null> {
  return await detectMaliciousRequest(req);
}

/**
 * Sanitization configuration for different field types
 * Use this to configure field-specific sanitization rules
 */
export const sanitizationRules = {
  // User fields
  email: { type: "email" as const },
  name: { type: "text" as const, maxLength: 100 },
  phone: { type: "phone" as const },

  // Train fields
  trainNumber: { type: "alphanumeric" as const, maxLength: 10 },
  trainName: { type: "text" as const, maxLength: 200 },

  // Station fields
  stationCode: { type: "alphanumeric" as const, maxLength: 4 },
  stationName: { type: "text" as const, maxLength: 100 },
  city: { type: "text" as const, maxLength: 100 },

  // Alert fields
  alertMessage: { type: "text" as const, maxLength: 500 },
  reason: { type: "text" as const, maxLength: 500 },

  // General fields
  description: { type: "text" as const, maxLength: 1000 },
  notes: { type: "text" as const, maxLength: 500 },
  url: { type: "url" as const },
};

/**
 * Apply sanitization rules to a specific field
 *
 * @param fieldName - Name of the field
 * @param value - Field value
 * @returns Sanitized value
 */
export function sanitizeField(fieldName: string, value: string): string {
  const rule = sanitizationRules[fieldName as keyof typeof sanitizationRules];

  if (!rule) {
    // Default sanitization for unknown fields
    return sanitizeHtml(value);
  }

  // Apply field-specific rules
  let sanitized = value;

  switch (rule.type) {
    case "email":
      sanitized = sanitizeHtml(value);
      break;
    case "phone":
      sanitized = value.replace(/[^0-9\s\-\(\)\+]/g, "");
      break;
    case "url":
      try {
        const url = new URL(value);
        if (url.protocol === "http:" || url.protocol === "https:") {
          sanitized = value;
        } else {
          sanitized = "";
        }
      } catch {
        sanitized = "";
      }
      break;
    case "alphanumeric":
      sanitized = value.replace(/[^a-zA-Z0-9\-_]/g, "");
      break;
    case "text":
    default:
      sanitized = sanitizeHtml(value);
      break;
  }

  // Apply max length
  if ("maxLength" in rule && rule.maxLength) {
    sanitized = sanitized.slice(0, rule.maxLength);
  }

  return sanitized;
}

/**
 * Batch sanitize multiple fields according to rules
 *
 * @param data - Object with field values
 * @returns Object with sanitized values
 */
export function sanitizeFields<T extends Record<string, unknown>>(data: T): T {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeField(key, value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}
