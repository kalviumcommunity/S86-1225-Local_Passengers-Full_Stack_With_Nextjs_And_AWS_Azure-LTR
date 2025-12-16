/**
 * Standardized Error Codes
 *
 * This file defines all error codes used across the application.
 * Error codes help with debugging, monitoring, and maintaining consistency.
 *
 * Format: <CATEGORY>_<SPECIFIC_ERROR>
 */

export const ERROR_CODES = {
  // Validation Errors (E001-E099)
  VALIDATION_ERROR: "E001",
  MISSING_REQUIRED_FIELD: "E002",
  INVALID_INPUT_FORMAT: "E003",
  INVALID_EMAIL_FORMAT: "E004",
  INVALID_PASSWORD_FORMAT: "E005",

  // Authentication Errors (E100-E199)
  AUTH_ERROR: "E100",
  INVALID_CREDENTIALS: "E101",
  TOKEN_EXPIRED: "E102",
  TOKEN_INVALID: "E103",
  TOKEN_MISSING: "E104",
  SESSION_EXPIRED: "E105",

  // Authorization Errors (E200-E299)
  FORBIDDEN: "E200",
  INSUFFICIENT_PERMISSIONS: "E201",
  ADMIN_ONLY: "E202",

  // Resource Errors (E300-E399)
  NOT_FOUND: "E300",
  USER_NOT_FOUND: "E301",
  TRAIN_NOT_FOUND: "E302",
  ALERT_NOT_FOUND: "E303",
  PROJECT_NOT_FOUND: "E304",
  TASK_NOT_FOUND: "E305",

  // Conflict Errors (E400-E499)
  CONFLICT: "E400",
  USER_ALREADY_EXISTS: "E401",
  DUPLICATE_ENTRY: "E402",
  RESOURCE_ALREADY_EXISTS: "E403",

  // Database Errors (E500-E599)
  DATABASE_ERROR: "E500",
  DATABASE_CONNECTION_FAILED: "E501",
  DATABASE_QUERY_FAILED: "E502",
  DATABASE_TRANSACTION_FAILED: "E503",

  // External API Errors (E600-E699)
  EXTERNAL_API_ERROR: "E600",
  RAILWAY_API_ERROR: "E601",
  RAILWAY_API_TIMEOUT: "E602",
  RAILWAY_API_UNAVAILABLE: "E603",

  // Server Errors (E700-E799)
  INTERNAL_ERROR: "E700",
  SERVER_ERROR: "E701",
  SERVICE_UNAVAILABLE: "E702",

  // Business Logic Errors (E800-E899)
  OPERATION_FAILED: "E800",
  ALERT_CREATION_FAILED: "E801",
  TRAIN_FETCH_FAILED: "E802",
  USER_CREATION_FAILED: "E803",
  PASSWORD_HASH_FAILED: "E804",
} as const;

// Type for error codes
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/**
 * Error Messages
 *
 * Default messages for common errors
 */
export const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.VALIDATION_ERROR]: "Validation failed",
  [ERROR_CODES.MISSING_REQUIRED_FIELD]: "Required field is missing",
  [ERROR_CODES.INVALID_INPUT_FORMAT]: "Invalid input format",
  [ERROR_CODES.INVALID_EMAIL_FORMAT]: "Invalid email format",
  [ERROR_CODES.INVALID_PASSWORD_FORMAT]:
    "Password must be at least 8 characters",

  [ERROR_CODES.AUTH_ERROR]: "Authentication failed",
  [ERROR_CODES.INVALID_CREDENTIALS]: "Invalid email or password",
  [ERROR_CODES.TOKEN_EXPIRED]: "Authentication token has expired",
  [ERROR_CODES.TOKEN_INVALID]: "Invalid authentication token",
  [ERROR_CODES.TOKEN_MISSING]: "Authentication token is missing",
  [ERROR_CODES.SESSION_EXPIRED]: "Session has expired",

  [ERROR_CODES.FORBIDDEN]: "Access forbidden",
  [ERROR_CODES.INSUFFICIENT_PERMISSIONS]:
    "Insufficient permissions to perform this action",
  [ERROR_CODES.ADMIN_ONLY]: "Admin access required",

  [ERROR_CODES.NOT_FOUND]: "Resource not found",
  [ERROR_CODES.USER_NOT_FOUND]: "User not found",
  [ERROR_CODES.TRAIN_NOT_FOUND]: "Train not found",
  [ERROR_CODES.ALERT_NOT_FOUND]: "Alert not found",
  [ERROR_CODES.PROJECT_NOT_FOUND]: "Project not found",
  [ERROR_CODES.TASK_NOT_FOUND]: "Task not found",

  [ERROR_CODES.CONFLICT]: "Resource conflict",
  [ERROR_CODES.USER_ALREADY_EXISTS]: "User with this email already exists",
  [ERROR_CODES.DUPLICATE_ENTRY]: "Duplicate entry detected",
  [ERROR_CODES.RESOURCE_ALREADY_EXISTS]: "Resource already exists",

  [ERROR_CODES.DATABASE_ERROR]: "Database operation failed",
  [ERROR_CODES.DATABASE_CONNECTION_FAILED]: "Database connection failed",
  [ERROR_CODES.DATABASE_QUERY_FAILED]: "Database query failed",
  [ERROR_CODES.DATABASE_TRANSACTION_FAILED]: "Database transaction failed",

  [ERROR_CODES.EXTERNAL_API_ERROR]: "External service error",
  [ERROR_CODES.RAILWAY_API_ERROR]: "Railway API error",
  [ERROR_CODES.RAILWAY_API_TIMEOUT]: "Railway API timeout",
  [ERROR_CODES.RAILWAY_API_UNAVAILABLE]: "Railway API unavailable",

  [ERROR_CODES.INTERNAL_ERROR]: "Internal server error",
  [ERROR_CODES.SERVER_ERROR]: "Server error",
  [ERROR_CODES.SERVICE_UNAVAILABLE]: "Service unavailable",

  [ERROR_CODES.OPERATION_FAILED]: "Operation failed",
  [ERROR_CODES.ALERT_CREATION_FAILED]: "Failed to create alert",
  [ERROR_CODES.TRAIN_FETCH_FAILED]: "Failed to fetch trains",
  [ERROR_CODES.USER_CREATION_FAILED]: "Failed to create user",
  [ERROR_CODES.PASSWORD_HASH_FAILED]: "Failed to hash password",
};

/**
 * Get error message by code
 */
export const getErrorMessage = (code: string): string => {
  return ERROR_MESSAGES[code] || "An unexpected error occurred";
};
