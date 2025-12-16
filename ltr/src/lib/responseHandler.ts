/**
 * Global API Response Handler
 *
 * This utility provides a standardized way to return responses from all API endpoints.
 * It ensures consistency, improves developer experience, and enhances observability.
 */

import { NextResponse } from "next/server";

/**
 * Standard Success Response Structure
 * {
 *   success: true,
 *   message: string,
 *   data: unknown,
 *   timestamp: string
 * }
 */
export const sendSuccess = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  message = "Success",
  status = 200
): NextResponse => {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
};

/**
 * Standard Error Response Structure
 * {
 *   success: false,
 *   message: string,
 *   error: { code: string, details?: unknown },
 *   timestamp: string
 * }
 */
export const sendError = (
  message = "Something went wrong",
  code = "INTERNAL_ERROR",
  status = 500,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any
): NextResponse => {
  return NextResponse.json(
    {
      success: false,
      message,
      error: {
        code,
        ...(details && { details }),
      },
      timestamp: new Date().toISOString(),
    },
    { status }
  );
};

/**
 * Validation Error Helper
 * Shorthand for validation errors (400)
 */
export const sendValidationError = (
  message: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any
): NextResponse => {
  return sendError(message, "VALIDATION_ERROR", 400, details);
};

/**
 * Authentication Error Helper
 * Shorthand for authentication errors (401)
 */
export const sendAuthError = (
  message = "Not authenticated",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any
): NextResponse => {
  return sendError(message, "AUTH_ERROR", 401, details);
};

/**
 * Authorization Error Helper
 * Shorthand for authorization/permission errors (403)
 */
export const sendForbiddenError = (
  message = "Access forbidden",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any
): NextResponse => {
  return sendError(message, "FORBIDDEN", 403, details);
};

/**
 * Not Found Error Helper
 * Shorthand for resource not found errors (404)
 */
export const sendNotFoundError = (
  message = "Resource not found",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any
): NextResponse => {
  return sendError(message, "NOT_FOUND", 404, details);
};

/**
 * Conflict Error Helper
 * Shorthand for conflict errors (409) - e.g., duplicate resource
 */
export const sendConflictError = (
  message = "Resource already exists",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any
): NextResponse => {
  return sendError(message, "CONFLICT", 409, details);
};

/**
 * Database Error Helper
 * Shorthand for database-related errors (500)
 */
export const sendDatabaseError = (
  message = "Database operation failed",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any
): NextResponse => {
  return sendError(message, "DATABASE_ERROR", 500, details);
};

/**
 * External API Error Helper
 * For errors from third-party/external API calls (502)
 */
export const sendExternalAPIError = (
  message = "External service unavailable",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any
): NextResponse => {
  return sendError(message, "EXTERNAL_API_ERROR", 502, details);
};
