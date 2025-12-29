import { NextRequest, NextResponse } from "next/server";

/**
 * CORS Configuration Utility
 * 
 * Implements secure Cross-Origin Resource Sharing (CORS) for API routes.
 * Prevents unauthorized domains from accessing your APIs.
 * 
 * Security Features:
 * - Whitelist-based origin validation
 * - Configurable HTTP methods
 * - Secure credential handling
 * - Preflight request support
 * 
 * OWASP Best Practices:
 * - Never use '*' for Access-Control-Allow-Origin in production
 * - Always validate origins against a whitelist
 * - Limit allowed methods to only what's necessary
 * - Use credentials flag carefully
 */

/**
 * Allowed origins for CORS
 * Add your production domains here
 */
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5174",
  "https://localhost:3000",
  "https://localhost:5174",
  // Add your production domains here:
  // "https://localpassengers.vercel.app",
  // "https://www.localpassengers.com",
];

/**
 * Default allowed HTTP methods
 */
const ALLOWED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];

/**
 * Default allowed headers
 */
const ALLOWED_HEADERS = [
  "Content-Type",
  "Authorization",
  "X-Requested-With",
  "Accept",
  "Origin",
];

/**
 * CORS configuration options
 */
interface CorsOptions {
  origins?: string[];
  methods?: string[];
  allowedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

/**
 * Check if the origin is allowed
 */
function isOriginAllowed(origin: string | null, allowedOrigins: string[]): boolean {
  if (!origin) return false;
  
  // Check exact match
  if (allowedOrigins.includes(origin)) return true;
  
  // Check wildcard patterns (e.g., *.vercel.app)
  return allowedOrigins.some((allowed) => {
    if (allowed.includes("*")) {
      const pattern = allowed.replace(/\*/g, ".*");
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(origin);
    }
    return false;
  });
}

/**
 * Apply CORS headers to a Response object
 */
export function setCorsHeaders(
  response: NextResponse,
  request: NextRequest,
  options: CorsOptions = {}
): NextResponse {
  const {
    origins = ALLOWED_ORIGINS,
    methods = ALLOWED_METHODS,
    allowedHeaders = ALLOWED_HEADERS,
    credentials = true,
    maxAge = 86400, // 24 hours
  } = options;

  const origin = request.headers.get("origin");

  // Validate origin
  if (origin && isOriginAllowed(origin, origins)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  // Set other CORS headers
  response.headers.set("Access-Control-Allow-Methods", methods.join(", "));
  response.headers.set("Access-Control-Allow-Headers", allowedHeaders.join(", "));
  response.headers.set("Access-Control-Max-Age", maxAge.toString());

  if (credentials) {
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

/**
 * Handle preflight OPTIONS requests
 */
export function handleCorsPreflightRequest(
  request: NextRequest,
  options: CorsOptions = {}
): NextResponse {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response, request, options);
}

/**
 * CORS middleware wrapper for API routes
 * 
 * Usage:
 * ```typescript
 * export async function GET(req: NextRequest) {
 *   return withCors(req, async () => {
 *     // Your API logic here
 *     return NextResponse.json({ data: "..." });
 *   });
 * }
 * ```
 */
export async function withCors(
  request: NextRequest,
  handler: () => Promise<NextResponse> | NextResponse,
  options: CorsOptions = {}
): Promise<NextResponse> {
  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return handleCorsPreflightRequest(request, options);
  }

  // Execute the handler
  const response = await handler();

  // Apply CORS headers to the response
  return setCorsHeaders(response, request, options);
}

/**
 * Validate CORS for API routes (for use in middleware or route handlers)
 */
export function validateCorsOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  return isOriginAllowed(origin, ALLOWED_ORIGINS);
}

/**
 * Create a CORS error response
 */
export function createCorsErrorResponse(request: NextRequest): NextResponse {
  const origin = request.headers.get("origin");
  
  return NextResponse.json(
    {
      success: false,
      message: "CORS policy violation: Origin not allowed",
      errorCode: "CORS_ORIGIN_NOT_ALLOWED",
      origin: origin,
      hint: "This origin is not whitelisted for API access. Contact the administrator.",
    },
    { status: 403 }
  );
}

/**
 * Export allowed origins for use in other parts of the app
 */
export { ALLOWED_ORIGINS };
