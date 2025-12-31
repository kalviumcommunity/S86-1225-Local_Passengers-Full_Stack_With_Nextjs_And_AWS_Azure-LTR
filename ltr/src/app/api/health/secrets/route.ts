import { NextResponse } from "next/server";
import { getSecretsDiagnostics, getSecretValue } from "@/lib/cloudSecrets";
import { logApiError, logApiEvent } from "@/lib/logger";

export const runtime = "nodejs";

/**
 * Secrets Health Check Endpoint
 * GET /api/health/secrets
 *
 * Returns only metadata (provider + key names). Never returns secret values.
 *
 * In production, requires `x-debug-token` header matching `SECRETS_DEBUG_TOKEN`.
 */
export async function GET(req: Request) {
  const start = Date.now();
  logApiEvent("info", req, "Secrets health check received");

  const expectedToken = process.env.SECRETS_DEBUG_TOKEN;
  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    if (!expectedToken) {
      logApiEvent("warn", req, "Secrets health check not enabled in prod", {
        durationMs: Date.now() - start,
        status: 404,
      });
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    }
    const provided = req.headers.get("x-debug-token");
    if (!provided || provided !== expectedToken) {
      logApiEvent("warn", req, "Secrets health check forbidden", {
        durationMs: Date.now() - start,
        status: 403,
      });
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }
  }

  try {
    const diag = await getSecretsDiagnostics();

    // Probe a couple common keys (still does not return values)
    const hasDatabaseUrl = Boolean(await getSecretValue("DATABASE_URL"));
    const hasJwtSecret = Boolean(await getSecretValue("JWT_SECRET"));
    const hasJwtRefreshSecret = Boolean(
      await getSecretValue("JWT_REFRESH_SECRET")
    );

    logApiEvent("info", req, "Secrets health check ok", {
      durationMs: Date.now() - start,
      status: 200,
      provider: diag.provider,
    });

    return NextResponse.json({
      success: true,
      provider: diag.provider,
      keysLoaded: diag.keys,
      probes: {
        DATABASE_URL: hasDatabaseUrl,
        JWT_SECRET: hasJwtSecret,
        JWT_REFRESH_SECRET: hasJwtRefreshSecret,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    logApiError(req, error, "Secrets health check failed", {
      durationMs: Date.now() - start,
      status: 500,
    });
    return NextResponse.json(
      {
        success: false,
        message: "Secrets retrieval failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
