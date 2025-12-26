import { NextResponse } from "next/server";

/**
 * Token Storage and Cookie Management
 * Implements secure cookie-based storage for JWT tokens
 *
 * Security Features:
 * - HTTP-only cookies: Prevents XSS attacks (JavaScript cannot access)
 * - Secure flag: Ensures cookies only sent over HTTPS in production
 * - SameSite=Strict: Prevents CSRF attacks
 * - Separate storage for access and refresh tokens
 */

const isProduction = process.env.NODE_ENV === "production";

/**
 * Cookie Configuration for Access Token
 * Short-lived, used for API authentication
 */
export const ACCESS_TOKEN_COOKIE = {
  name: "accessToken",
  options: {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict" as const,
    maxAge: 15 * 60, // 15 minutes in seconds
    path: "/",
  },
};

/**
 * Cookie Configuration for Refresh Token
 * Long-lived, used to generate new access tokens
 */
export const REFRESH_TOKEN_COOKIE = {
  name: "refreshToken",
  options: {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: "/api/auth/refresh", // Only sent to refresh endpoint
  },
};

/**
 * Set authentication cookies in response
 * Stores both access and refresh tokens securely
 *
 * @param response - NextResponse object
 * @param accessToken - JWT access token
 * @param refreshToken - JWT refresh token
 * @returns Modified response with cookies set
 */
export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
): NextResponse {
  // Set access token cookie
  response.cookies.set(
    ACCESS_TOKEN_COOKIE.name,
    accessToken,
    ACCESS_TOKEN_COOKIE.options
  );

  // Set refresh token cookie
  response.cookies.set(
    REFRESH_TOKEN_COOKIE.name,
    refreshToken,
    REFRESH_TOKEN_COOKIE.options
  );

  return response;
}

/**
 * Clear authentication cookies
 * Used during logout
 *
 * @param response - NextResponse object
 * @returns Modified response with cookies cleared
 */
export function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.set(ACCESS_TOKEN_COOKIE.name, "", {
    ...ACCESS_TOKEN_COOKIE.options,
    maxAge: 0,
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE.name, "", {
    ...REFRESH_TOKEN_COOKIE.options,
    maxAge: 0,
  });

  return response;
}

/**
 * Extract access token from request
 * Checks both Authorization header and cookie
 *
 * Priority:
 * 1. Authorization: Bearer <token> header
 * 2. accessToken cookie
 *
 * @param request - Request object with headers and cookies
 * @returns Access token or null
 */
export function getAccessToken(request: {
  headers: Headers;
  cookies: { get: (name: string) => { value: string } | undefined };
}): string | null {
  // Check Authorization header first
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Check cookie
  return request.cookies.get(ACCESS_TOKEN_COOKIE.name)?.value || null;
}

/**
 * Extract refresh token from request cookies
 *
 * @param request - Request object with cookies
 * @returns Refresh token or null
 */
export function getRefreshToken(request: {
  cookies: { get: (name: string) => { value: string } | undefined };
}): string | null {
  return request.cookies.get(REFRESH_TOKEN_COOKIE.name)?.value || null;
}

/**
 * Create response with new access token
 * Used in token refresh flow
 *
 * @param accessToken - New access token
 * @param data - Response data
 * @returns NextResponse with new access token cookie
 */
export function createTokenRefreshResponse(
  accessToken: string,
  data: unknown
): NextResponse {
  const response = NextResponse.json(data);

  response.cookies.set(
    ACCESS_TOKEN_COOKIE.name,
    accessToken,
    ACCESS_TOKEN_COOKIE.options
  );

  return response;
}
