import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

if (!process.env.JWT_REFRESH_SECRET) {
  throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Token expiry durations
export const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
export const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days

/**
 * JWT Token Payload Interface
 * Contains user information embedded in the token
 */
export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

/**
 * Generate Access Token
 * Short-lived token (15 minutes) used for API authentication
 *
 * Structure:
 * - Header: { alg: "HS256", typ: "JWT" }
 * - Payload: { userId, email, role, iat, exp }
 * - Signature: HMACSHA256(header + payload, JWT_SECRET)
 *
 * @param payload - User information to encode in token
 * @returns Access token string
 */
export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    algorithm: "HS256",
  });
}

/**
 * Generate Refresh Token
 * Long-lived token (7 days) used to obtain new access tokens
 * Stored as HTTP-only cookie for security
 *
 * @param payload - User information to encode in token
 * @returns Refresh token string
 */
export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
    algorithm: "HS256",
  });
}

/**
 * Verify Access Token
 * Validates token signature and expiry
 *
 * @param token - Access token to verify
 * @returns Decoded payload or null if invalid
 */
export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    }) as JWTPayload;
    return decoded;
  } catch {
    // Token expired, invalid signature, or malformed
    return null;
  }
}

/**
 * Verify Refresh Token
 * Validates refresh token signature and expiry
 *
 * @param token - Refresh token to verify
 * @returns Decoded payload or null if invalid
 */
export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      algorithms: ["HS256"],
    }) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Decode JWT without verification (for debugging)
 * WARNING: Never use for authentication - only for inspection
 *
 * @param token - JWT token to decode
 * @returns Decoded token or null
 */
export function decodeToken(token: string): { exp?: number } | null {
  try {
    return jwt.decode(token) as { exp?: number } | null;
  } catch {
    return null;
  }
}

/**
 * Check if token is expired
 * @param token - JWT token to check
 * @returns true if expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

/**
 * Get token expiry time in seconds
 * @param token - JWT token
 * @returns Expiry timestamp or null
 */
export function getTokenExpiry(token: string): number | null {
  const decoded = decodeToken(token);
  return decoded?.exp || null;
}
